import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { useUserProfile } from '../hooks/useUserProfile';
import { shouldPromptMigration } from '../utils/migration';
import MigrationModal from '../components/MigrationModal';
import CreateProjectModal from '../components/CreateProjectModal';
import ProjectCard from '../components/ProjectCard';
import SettingsModal from '../components/SettingsModal';
import ShareProjectModal from '../components/ShareProjectModal';
import { ProjectMetadata } from '../types/user';
import toast from 'react-hot-toast';
import { verifyCheckout } from '../utils/billing';
import { upgradeUserToPro } from '../firebase/userService';

const PAYMENT_LINK = (import.meta as any)?.env?.VITE_STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/9B6aEX1Kw6R02BtcsodfG00';

export default function ProjectsDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile } = useUserProfile();
  const { 
    projects, 
    sharedProjects, 
    loading, 
    createProject, 
    deleteProject,
    duplicateProject,
  } = useProjects();
  
  const [showMigration, setShowMigration] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [shareProject, setShareProject] = useState<ProjectMetadata | null>(null);

  // Dev-only bypass indicator
  const devBypassActive = useMemo(() => {
    try {
      const isDev = (import.meta as any)?.env?.DEV;
      if (!isDev) return false;
      const url = new URL(window.location.href);
      return url.searchParams.get('bypass') === '1' || localStorage.getItem('dev-auth-bypass') === '1';
    } catch {
      return false;
    }
  }, []);

  // Check for migration on mount
  useEffect(() => {
    if (user && shouldPromptMigration(user.uid)) {
      setShowMigration(true);
    }
  }, [user]);

  // Handle Stripe checkout return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get('checkout');
    const sessionId = params.get('session_id') || '';
    if (!checkout) return;

    const clearParams = () => {
      params.delete('checkout');
      params.delete('session_id');
      const qs = params.toString();
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    };

    if (checkout === 'cancel') {
      toast('Checkout canceled', { icon: '⚠️' });
      clearParams();
      return;
    }

    if (checkout === 'success' && sessionId && user) {
      (async () => {
        try {
          const res = await verifyCheckout(sessionId);
          if (res.status === 'complete' || res.subscriptionId) {
            await upgradeUserToPro(user.uid);
            toast.success('Upgraded to Pro!');
          } else {
            toast.error('Checkout not completed');
          }
        } catch (err: any) {
          console.error('Verify checkout failed:', err);
          toast.error(err?.message || 'Failed to verify checkout');
        } finally {
          clearParams();
        }
      })();
    }
  }, [user]);

  // Filter projects by search query
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = async (name: string, description?: string) => {
    try {
      const newProject = await createProject(name, description);
      toast.success(`Created "${name}"`);
      navigate(`/editor/${newProject.id}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/editor/${projectId}`);
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`Delete "${projectName}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteProject(projectId);
      toast.success(`Deleted "${projectName}"`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDuplicateProject = async (projectId: string, projectName: string) => {
    try {
      await duplicateProject(projectId, `${projectName} (Copy)`);
      toast.success(`Duplicated "${projectName}"`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const canCreateMore = profile && projects.length < profile.subscription.projectLimit;

  // Start Stripe checkout
  const handleUpgrade = async () => {
    window.location.href = PAYMENT_LINK;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Migration Modal */}
      {showMigration && user && (
        <MigrationModal
          userId={user.uid}
          onComplete={(projectId) => {
            setShowMigration(false);
            if (projectId) {
              toast.success('Project migrated to cloud!');
              navigate(`/editor/${projectId}`);
            }
          }}
          onSkip={() => {
            setShowMigration(false);
            toast('You can always create a new project', { icon: '💡' });
          }}
        />
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateProject}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Share Project Modal */}
      {shareProject && (
        <ShareProjectModal
          project={shareProject}
          onClose={() => setShareProject(null)}
        />
      )}

      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        {/* Dev bypass banner */}
        {devBypassActive && (
          <div className="bg-yellow-900/40 border-b border-yellow-700 text-yellow-300 text-center text-xs py-1">
            Dev auth bypass is active (testing mode). Cloud writes may require sign-in depending on Firestore rules.
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <div>
                <h1 className="text-2xl font-bold">RetroWire</h1>
                <p className="text-sm text-gray-400">My Projects</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {/* User Avatar & Name */}
              <div className="flex items-center gap-2">
                <img
                  src={profile?.photoURL || user?.photoURL || 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-gray-700"
                />
                <span className="text-sm font-medium">
                  {profile?.displayName || user?.displayName || 'User'}
                </span>
              </div>

              {/* Settings & Logout */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Settings"
              >
                ⚙️
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-gray-700' : 'hover:bg-gray-800'
                }`}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 transition-colors ${
                  viewMode === 'list' ? 'bg-gray-700' : 'hover:bg-gray-800'
                }`}
              >
                ☰
              </button>
            </div>

            {/* Create Project */}
            <button
              onClick={() => {
                if (!canCreateMore) {
                  toast.error(`Free plan limited to ${profile?.subscription.projectLimit} projects`);
                  return;
                }
                setShowCreateModal(true);
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <span>+</span>
              New Project
            </button>
          </div>
        </div>

        {/* Project Limit Indicator */}
        {profile && (
          <div className="mb-6 bg-gray-900 border border-gray-700 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <span className="text-gray-400">Projects:</span>
                <span className="ml-2 font-bold text-white">
                  {projects.length} / {profile.subscription.projectLimit}
                </span>
              </div>
              <div className="w-48 bg-gray-800 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(projects.length / profile.subscription.projectLimit) * 100}%`,
                  }}
                />
              </div>
            </div>
            {profile.subscription.tier === 'free' && (
              <button
                onClick={handleUpgrade}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Upgrade to Pro for unlimited projects →
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading projects...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && searchQuery === '' && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-2xl font-bold mb-2">No Projects Yet</h2>
              <p className="text-gray-400 mb-6">
                Create your first wiring diagram to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
              >
                Create Your First Project
              </button>
            </div>
          </div>
        )}

        {/* No Search Results */}
        {!loading && filteredProjects.length === 0 && searchQuery !== '' && (
          <div className="text-center py-20">
            <p className="text-gray-400">
              No projects found matching "{searchQuery}"
            </p>
          </div>
        )}

        {/* Projects Grid/List */}
        {!loading && filteredProjects.length > 0 && (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewMode={viewMode}
                  onOpen={() => handleOpenProject(project.id)}
                  onDelete={() => handleDeleteProject(project.id, project.name)}
                  onDuplicate={() => handleDuplicateProject(project.id, project.name)}
                  onShare={() => setShareProject(project)}
                />
              ))}
            </div>

            {/* Shared Projects Section */}
            {sharedProjects.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>👥</span>
                  Shared With Me
                </h2>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {sharedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      viewMode={viewMode}
                      onOpen={() => handleOpenProject(project.id)}
                      isShared={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

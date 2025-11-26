import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject } from '../firebase/projectService';
import type { ProjectData } from '../types/user';

export default function SharedProject() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shareLink = useMemo(
    () => (projectId ? `${window.location.origin}/shared/${projectId}` : ''),
    [projectId]
  );

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!projectId) {
        setError('Invalid project link');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const p = await getProject(projectId);
        if (!mounted) return;
        if (!p) {
          setError('Project not found');
        } else if (!p.isPublic) {
          setError('This project is not public');
        } else {
          setProject(p);
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load project');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      alert('Link copied to clipboard');
    } catch {
      alert('Failed to copy link');
    }
  };

  const openInEditor = () => {
    if (!projectId) return;
    navigate(`/editor/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔗</span>
            <div>
              <h1 className="text-xl font-bold">Shared Project</h1>
              <p className="text-xs text-gray-400">View-only</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyLink}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
              title="Copy public link"
            >
              Copy Link
            </button>
            <button
              onClick={openInEditor}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
              title="Open in editor (sign in required)"
            >
              Open in Editor
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading project...</p>
          </div>
        )}

        {!loading && error && (
          <div className="max-w-lg mx-auto bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">⚠️</div>
            <h2 className="text-lg font-bold mb-2">Unable to view project</h2>
            <p className="text-sm text-gray-300">{error}</p>
          </div>
        )}

        {!loading && project && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Thumbnail */}
            <div className="md:col-span-2">
              <div className="aspect-video bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                {project.thumbnail ? (
                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
                  <img
                    src={project.thumbnail}
                    alt="Project thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl">⚡</div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-3 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{project.name}</h2>
                {project.description && (
                  <p className="text-gray-300 mt-1">{project.description}</p>
                )}
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Preferred Voltage</div>
                    <div className="font-medium">{project.preferredVoltage}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Components</div>
                    <div className="font-medium">{project.nodes?.length || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Connections</div>
                    <div className="font-medium">{project.edges?.length || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Visibility</div>
                    <div className="font-medium">{project.isPublic ? 'Public' : 'Private'}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyLink}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
                >
                  Copy Link
                </button>
                <button
                  onClick={openInEditor}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Open in Editor
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Opening in the editor requires authentication and appropriate permissions.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

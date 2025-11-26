import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useUserProfile } from '../hooks/useUserProfile';
import { useTheme } from '../contexts/ThemeContext';
import { uploadAvatar } from '../firebase/storageService';
import { exportUserProjects } from '../utils/exportProjects';
import { useAuth } from '../firebase/AuthContext';

type TabKey = 'profile' | 'preferences' | 'data';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { profile, updateProfile, updatePreferences } = useUserProfile();
  const { theme, setTheme } = useTheme();
  const { deleteAccount } = useAuth();

  // Tabs
  const [tab, setTab] = useState<TabKey>('profile');

  // Profile state (editable)
  const [displayName, setDisplayName] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Preferences state
  const [defaultVoltage, setDefaultVoltage] = useState<'5V' | '12V'>('5V');
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState<number>(3);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Initialize from profile
  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName || '');
    setPhotoPreview(profile.photoURL);
    setDefaultVoltage(profile.preferences?.defaultVoltage ?? '5V');
    setAutoSave(profile.preferences?.autoSave ?? true);
    setAutoSaveInterval(profile.preferences?.autoSaveInterval ?? 3);
  }, [profile]);

  const email = useMemo(() => profile?.email || '', [profile]);

  // Handlers - Profile
  const handleAvatarFile = async (file: File) => {
    if (!profile) return;
    try {
      setUploadingAvatar(true);
      const base64 = await uploadAvatar(profile.uid, file);
      // Save custom avatar and switch off gravatar
      await updateProfile({
        customAvatarURL: base64,
        photoURL: base64,
        useGravatar: false,
      });
      setPhotoPreview(base64);
      toast.success('Avatar updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUseGravatar = async () => {
    if (!profile) return;
    try {
      setSavingProfile(true);
      await updateProfile({ useGravatar: true });
      toast.success('Using Gravatar avatar');
    } catch (err: any) {
      toast.error(err.message || 'Failed to switch to Gravatar');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    if (!displayName.trim()) {
      toast.error('Display name is required');
      return;
    }
    try {
      setSavingProfile(true);
      await updateProfile({ displayName: displayName.trim() });
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handlers - Preferences
  const handleSavePreferences = async () => {
    if (!profile) return;
    // Validate autosave interval
    const clamped = Math.max(1, Math.min(30, Math.round(autoSaveInterval)));
    try {
      setSavingPrefs(true);
      await updatePreferences({
        defaultVoltage,
        autoSave,
        autoSaveInterval: clamped,
      });
      toast.success('Preferences saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save preferences');
    } finally {
      setSavingPrefs(false);
    }
  };

  // Data actions (placeholders)
  const handleExportData = async () => {
    if (!profile) {
      toast.error('You must be signed in to export');
      return;
    }
    try {
      setExporting(true);
      await toast.promise(
        exportUserProjects(profile.uid),
        {
          loading: 'Preparing your backup...',
          success: 'Download started',
          error: 'Failed to export projects',
        }
      );
    } catch (err: any) {
      console.error('Export failed:', err);
      toast.error(err?.message || 'Failed to export projects');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile) {
      toast.error('You must be signed in');
      return;
    }
    const confirmed = confirm(
      'This will permanently delete your account and all projects. This action cannot be undone.\n\nType OK to confirm.'
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      await toast.promise(
        deleteAccount(),
        {
          loading: 'Deleting your account...',
          success: 'Account deleted',
          error: (e) =>
            e?.code === 'auth/requires-recent-login'
              ? 'Please re-authenticate and try again'
              : 'Failed to delete account',
        }
      );
      // Redirect to landing after deletion/signout
      window.location.href = '/';
    } catch (err: any) {
      console.error('Delete account failed:', err);
      if (err?.code === 'auth/requires-recent-login') {
        toast.error('Please sign out and sign back in, then try again');
      } else {
        toast.error(err?.message || 'Failed to delete account');
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">Account Settings</h2>
            <p className="text-sm text-gray-400">Manage your profile, preferences, and data</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('profile')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                tab === 'profile' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setTab('preferences')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                tab === 'preferences' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setTab('data')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                tab === 'data' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              Data & Privacy
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Profile Tab */}
          {tab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Avatar */}
              <div>
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-700 mb-3">
                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                  <img
                    src={photoPreview || profile?.photoURL || 'https://via.placeholder.com/112'}
                    alt="Profile photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center justify-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer text-sm">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingAvatar}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarFile(file);
                      }}
                    />
                    {uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                  </label>
                  <button
                    onClick={handleUseGravatar}
                    disabled={savingProfile}
                    className="px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-sm disabled:opacity-50"
                  >
                    Use Gravatar
                  </button>
                </div>
              </div>

              {/* Profile form */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile || !displayName.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                  >
                    {savingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {tab === 'preferences' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Theme</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-gray-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                    >
                      Light
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Theme is saved to your profile when signed in.</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Default Voltage</label>
                  <select
                    value={defaultVoltage}
                    onChange={(e) => setDefaultVoltage(e.target.value as '5V' | '12V')}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  >
                    <option value="5V">5V</option>
                    <option value="12V">12V</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-300">Auto-save</div>
                    <div className="text-xs text-gray-500">Automatically save projects while editing</div>
                  </div>
                  <button
                    onClick={() => setAutoSave((v) => !v)}
                    className={`px-3 py-1 rounded-full border border-gray-700 ${autoSave ? 'bg-green-600/30 text-green-300' : 'bg-gray-900 text-gray-300'}`}
                  >
                    {autoSave ? 'On' : 'Off'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Auto-save Interval (seconds)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={autoSaveInterval}
                    onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
                    className="w-32 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSavePreferences}
                    disabled={savingPrefs}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                  >
                    {savingPrefs ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data & Privacy Tab */}
          {tab === 'data' && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Export data</div>
                    <div className="text-sm text-gray-400">Download your projects and settings</div>
                  </div>
                  <button
                    onClick={handleExportData}
                    disabled={!profile || exporting}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50"
                  >
                    {exporting ? 'Exporting...' : 'Export Data'}
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-red-300">Delete account</div>
                    <div className="text-sm text-gray-400">Permanently delete your account and data</div>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

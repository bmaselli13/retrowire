import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  shareProjectWithUsers,
  unshareProjectWithUser,
  toggleProjectPublic,
} from '../firebase/projectService';
import type { ProjectMetadata } from '../types/user';

interface ShareProjectModalProps {
  project: ProjectMetadata;
  onClose: () => void;
}

export default function ShareProjectModal({ project, onClose }: ShareProjectModalProps) {
  const [emails, setEmails] = useState<string>('');
  const [sharedWith, setSharedWith] = useState<string[]>(project.sharedWith || []);
  const [isPublic, setIsPublic] = useState<boolean>(!!project.isPublic);
  const [working, setWorking] = useState<boolean>(false);

  useEffect(() => {
    setSharedWith(project.sharedWith || []);
    setIsPublic(!!project.isPublic);
  }, [project]);

  const shareLink = useMemo(
    () => `${window.location.origin}/shared/${project.id}`,
    [project.id]
  );

  const normalizedEmails = (value: string): string[] => {
    return value
      .split(/[,\s;]/g)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0 && e.includes('@'));
  };

  const handleAddShares = async () => {
    const list = normalizedEmails(emails);
    if (list.length === 0) {
      toast.error('Enter at least one valid email');
      return;
    }
    try {
      setWorking(true);
      await shareProjectWithUsers(project.id, list);
      setSharedWith((prev) => Array.from(new Set([...prev, ...list])));
      setEmails('');
      toast.success('Access granted');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to share project');
    } finally {
      setWorking(false);
    }
  };

  const handleRemoveShare = async (email: string) => {
    try {
      setWorking(true);
      await unshareProjectWithUser(project.id, email);
      setSharedWith((prev) => prev.filter((e) => e !== email));
      toast.success('Access removed');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to remove access');
    } finally {
      setWorking(false);
    }
  };

  const handleTogglePublic = async () => {
    try {
      setWorking(true);
      const newState = await toggleProjectPublic(project.id);
      setIsPublic(newState);
      toast.success(newState ? 'Project is now public' : 'Project set to private');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to update public status');
    } finally {
      setWorking(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-white">Share Project</h2>
            <p className="text-xs text-gray-400 truncate">{project.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Public toggle */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-white flex items-center gap-2">
                  {isPublic ? 'Public link enabled' : 'Public link disabled'}
                  {isPublic && <span className="text-xs px-2 py-0.5 bg-green-700/40 rounded-full">Public</span>}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {isPublic
                    ? 'Anyone with the link can view this project.'
                    : 'Only invited users can access this project.'}
                </p>
                {isPublic && (
                  <div className="mt-2 flex items-center gap-2">
                    <code className="text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1 break-all">
                      {shareLink}
                    </code>
                    <button
                      onClick={copyLink}
                      className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleTogglePublic}
                disabled={working}
                className={`px-3 py-2 rounded-lg text-sm ${
                  isPublic ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
                } disabled:opacity-50`}
                title={isPublic ? 'Disable public link' : 'Enable public link'}
              >
                {isPublic ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>

          {/* Invite by email */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="text-sm text-white font-medium mb-2">Invite people</div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="email1@example.com, email2@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                disabled={working}
                className="flex-1 px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={handleAddShares}
                disabled={working}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
              >
                Invite
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas or spaces</p>
          </div>

          {/* Shared users list */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="text-sm text-white font-medium mb-3">People with access</div>
            {sharedWith.length === 0 ? (
              <div className="text-xs text-gray-500">No one has access yet.</div>
            ) : (
              <ul className="space-y-2">
                {sharedWith.map((email) => (
                  <li key={email} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{email}</span>
                    <button
                      onClick={() => handleRemoveShare(email)}
                      disabled={working}
                      className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded disabled:opacity-50"
                      title="Remove access"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-700 flex items-center justify-end">
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

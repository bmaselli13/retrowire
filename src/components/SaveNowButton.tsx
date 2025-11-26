import { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useStore } from '../store';
import { useAuth } from '../firebase/AuthContext';

/**
 * Manual "Save now" action to trigger a cloud save of the current project.
 * Useful when autosave is off or to verify cloud connectivity.
 */
export default function SaveNowButton() {
  const { user } = useAuth();
  const { projectId } = useParams<{ projectId: string }>();
  const { saveProject } = useProjects();
  const { nodes, edges, preferredVoltage } = useStore();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!projectId) {
      toast.error('No project loaded');
      return;
    }
    try {
      setSaving(true);
      await saveProject(projectId, nodes, edges, preferredVoltage);
      toast.success('Project saved');
    } catch (err: any) {
      if (!user) {
        toast.error('Sign in to save to cloud');
      } else {
        toast.error(err?.message || 'Save failed');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className="fixed bottom-4 right-28 text-xs px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 border border-blue-500"
      title="Save now"
    >
      {saving ? 'Saving…' : 'Save now'}
    </button>
  );
}

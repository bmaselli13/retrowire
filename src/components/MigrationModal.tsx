import { useState } from 'react';
import { 
  migrateLocalStorageProject, 
  clearLocalStorageProject, 
  markMigrationCompleted,
  getLocalStorageProject 
} from '../utils/migration';

interface MigrationModalProps {
  userId: string;
  onComplete: (projectId?: string) => void;
  onSkip: () => void;
}

export default function MigrationModal({ userId, onComplete, onSkip }: MigrationModalProps) {
  const [migrating, setMigrating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const localProject = getLocalStorageProject();
  const projectName = localProject?.name || 'Untitled Project';
  const nodeCount = localProject?.nodes?.length || 0;
  const edgeCount = localProject?.edges?.length || 0;

  const handleMigrate = async () => {
    try {
      setMigrating(true);
      setError(null);
      
      const projectId = await migrateLocalStorageProject(userId);
      
      if (projectId) {
        // Mark migration as complete
        markMigrationCompleted(userId);
        
        // Clear localStorage
        clearLocalStorageProject();
        
        onComplete(projectId);
      } else {
        throw new Error('Migration failed - no project data found');
      }
    } catch (err: any) {
      console.error('Migration error:', err);
      setError(err.message);
      setMigrating(false);
    }
  };

  const handleSkip = () => {
    // Mark as completed (user chose to skip)
    markMigrationCompleted(userId);
    onSkip();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Migrate Your Project</h2>
            <p className="text-sm text-gray-400">Save your work to the cloud</p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            We found an existing project saved locally. Would you like to save it to the cloud?
          </p>
          
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Project:</span>
              <span className="text-white font-medium">{projectName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Components:</span>
              <span className="text-white">{nodeCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Connections:</span>
              <span className="text-white">{edgeCount}</span>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-300 mb-2 font-medium">
            ✨ Cloud benefits:
          </p>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>• Access from any device</li>
            <li>• Never lose your work</li>
            <li>• Share with others</li>
            <li>• Automatic backups</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            disabled={migrating}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip
          </button>
          <button
            onClick={handleMigrate}
            disabled={migrating}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {migrating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Migrating...
              </>
            ) : (
              'Save to Cloud'
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Your local project will remain until migration is complete
        </p>
      </div>
    </div>
  );
}

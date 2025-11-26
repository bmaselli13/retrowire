import { ProjectMetadata } from '../types/user';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: ProjectMetadata;
  viewMode: 'grid' | 'list';
  onOpen: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onShare?: () => void;
  isShared?: boolean;
}

export default function ProjectCard({
  project,
  viewMode,
  onOpen,
  onDelete,
  onDuplicate,
  onShare,
  isShared = false,
}: ProjectCardProps) {
  const formatDate = (timestamp: any) => {
    try {
      // Handle Firestore Timestamp
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          <div className="w-32 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
            {project.thumbnail ? (
              <img
                src={project.thumbnail}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                ⚡
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate mb-1">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-sm text-gray-400 truncate mb-2">
                {project.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Updated {formatDate(project.updatedAt)}</span>
              <span>•</span>
              <span>{project.preferredVoltage}</span>
              {project.isPublic && (
                <>
                  <span>•</span>
                  <span className="text-green-400">🌐 Public</span>
                </>
              )}
              {isShared && (
                <>
                  <span>•</span>
                  <span className="text-blue-400">👥 Shared</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpen}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
            >
              Open
            </button>
            {!isShared && (
              <>
                {onDuplicate && (
                  <button
                    onClick={onDuplicate}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    title="Duplicate"
                  >
                    📋
                  </button>
                )}
                {onShare && (
                  <button
                    onClick={onShare}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    title="Share"
                  >
                    🔗
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="p-2 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors group">
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-800 relative overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            ⚡
          </div>
        )}
        
        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={onOpen}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
          >
            Open
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-2">
          {project.isPublic && (
            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
              🌐 Public
            </span>
          )}
          {isShared && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
              👥 Shared
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate mb-1">
          {project.name}
        </h3>
        {project.description && (
          <p className="text-sm text-gray-400 line-clamp-2 mb-3 min-h-[2.5rem]">
            {project.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Updated {formatDate(project.updatedAt)}</span>
          <span className="text-gray-400">{project.preferredVoltage}</span>
        </div>

        {/* Actions */}
        {!isShared && (
          <div className="flex gap-2 pt-3 border-t border-gray-800">
            {onDuplicate && (
              <button
                onClick={onDuplicate}
                className="flex-1 p-2 hover:bg-gray-800 rounded-lg transition-colors text-sm"
                title="Duplicate"
              >
                📋 Copy
              </button>
            )}
            {onShare && (
              <button
                onClick={onShare}
                className="flex-1 p-2 hover:bg-gray-800 rounded-lg transition-colors text-sm"
                title="Share"
              >
                🔗 Share
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex-1 p-2 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors text-sm"
                title="Delete"
              >
                🗑️ Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

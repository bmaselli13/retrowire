import { memo } from 'react';
import { EdgeProps, getBezierPath, BaseEdge, EdgeLabelRenderer } from '@xyflow/react';

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as { color?: string; strokeWidth?: number; label?: string } | undefined;
  const edgeColor = edgeData?.color || (style?.stroke as string) || '#6b7280';
  const strokeWidth = edgeData?.strokeWidth || (style?.strokeWidth as number) || 3;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: edgeColor,
          strokeWidth: strokeWidth,
        }}
      />
      {edgeData?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded border border-gray-700 shadow-lg">
              {edgeData.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(CustomEdge);

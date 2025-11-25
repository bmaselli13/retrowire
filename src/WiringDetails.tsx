import { useMemo } from 'react';
import { Edge, Node } from '@xyflow/react';
import { useStore } from './store';
import { ComponentDefinition, Port } from './types';

interface WiringDetailsProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface ConnectionInfo {
  id: string;
  sourceComponent: string;
  sourcePort: string;
  targetComponent: string;
  targetPort: string;
  wireColor: string;
  voltage?: string;
  signalType?: string;
  label?: string;
}

function WiringDetails({ isOpen, onToggle }: WiringDetailsProps) {
  const { nodes, edges } = useStore();

  // Process connections to extract detailed information
  const connections = useMemo((): ConnectionInfo[] => {
    return edges.map((edge: Edge) => {
      const sourceNode = nodes.find((n: Node) => n.id === edge.source);
      const targetNode = nodes.find((n: Node) => n.id === edge.target);

      const sourceComponent = sourceNode?.data?.component as ComponentDefinition | undefined;
      const targetComponent = targetNode?.data?.component as ComponentDefinition | undefined;

      // Find port information
      const sourcePort = sourceComponent?.ports.find((p: Port) => p.id === edge.sourceHandle);
      const targetPort = targetComponent?.ports.find((p: Port) => p.id === edge.targetHandle);

      return {
        id: edge.id,
        sourceComponent: sourceComponent?.name || 'Unknown',
        sourcePort: sourcePort?.label || edge.sourceHandle || 'Unknown',
        targetComponent: targetComponent?.name || 'Unknown',
        targetPort: targetPort?.label || edge.targetHandle || 'Unknown',
        wireColor: (edge.data as any)?.color || '#6b7280',
        voltage: sourcePort?.voltage,
        signalType: sourcePort?.type,
        label: (edge.data as any)?.label,
      };
    });
  }, [edges, nodes]);

  // Calculate statistics
  const stats = useMemo(() => {
    const voltageCount: Record<string, number> = {};
    const signalCount: Record<string, number> = {};

    connections.forEach(conn => {
      if (conn.voltage) {
        voltageCount[conn.voltage] = (voltageCount[conn.voltage] || 0) + 1;
      }
      if (conn.signalType) {
        signalCount[conn.signalType] = (signalCount[conn.signalType] || 0) + 1;
      }
    });

    return {
      total: connections.length,
      voltageCount,
      signalCount,
    };
  }, [connections]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed right-4 top-20 z-10 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg border border-gray-700 shadow-lg transition-colors"
        title={isOpen ? 'Hide Wiring Details' : 'Show Wiring Details'}
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        )}
      </button>

      {/* Side Panel */}
      <div
        className={`fixed right-0 top-0 h-screen bg-gray-900 border-l border-gray-700 shadow-2xl transition-transform duration-300 ease-in-out z-20 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '400px' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-yellow-500">⚡</span>
                Wiring Details
              </h2>
              <button
                onClick={onToggle}
                className="text-gray-400 hover:text-white transition-colors"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="p-4 border-b border-gray-700 bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Total Connections:</span>
                <span className="text-white font-mono">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Components:</span>
                <span className="text-white font-mono">{nodes.length}</span>
              </div>
            </div>

            {/* Voltage Breakdown */}
            {Object.keys(stats.voltageCount).length > 0 && (
              <div className="mt-3">
                <h4 className="text-xs font-semibold text-gray-400 mb-1">By Voltage:</h4>
                <div className="space-y-1">
                  {Object.entries(stats.voltageCount).map(([voltage, count]) => (
                    <div key={voltage} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{voltage}</span>
                      <span className="text-white font-mono">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signal Type Breakdown */}
            {Object.keys(stats.signalCount).length > 0 && (
              <div className="mt-3">
                <h4 className="text-xs font-semibold text-gray-400 mb-1">By Signal Type:</h4>
                <div className="space-y-1">
                  {Object.entries(stats.signalCount).map(([signal, count]) => (
                    <div key={signal} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{signal.replace(/_/g, ' ')}</span>
                      <span className="text-white font-mono">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Connections List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">All Connections</h3>
            
            {connections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-sm">No connections yet</p>
                <p className="text-xs mt-1">Start wiring components together</p>
              </div>
            ) : (
              <div className="space-y-3">
                {connections.map((conn, index) => (
                  <div
                    key={conn.id}
                    className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    {/* Connection Number */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-500">#{index + 1}</span>
                      {conn.label && (
                        <span className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-300">
                          {conn.label}
                        </span>
                      )}
                    </div>

                    {/* Wire Color Indicator */}
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-full h-1 rounded"
                        style={{ backgroundColor: conn.wireColor }}
                      />
                    </div>

                    {/* Source */}
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 mb-0.5">From:</div>
                      <div className="text-sm text-white font-medium">{conn.sourceComponent}</div>
                      <div className="text-xs text-gray-400">{conn.sourcePort}</div>
                    </div>

                    {/* Arrow */}
                    <div className="text-center text-gray-600 text-xs my-1">↓</div>

                    {/* Target */}
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">To:</div>
                      <div className="text-sm text-white font-medium">{conn.targetComponent}</div>
                      <div className="text-xs text-gray-400">{conn.targetPort}</div>
                    </div>

                    {/* Technical Details */}
                    {(conn.voltage || conn.signalType) && (
                      <div className="mt-2 pt-2 border-t border-gray-700 flex gap-2 flex-wrap">
                        {conn.voltage && (
                          <span className="text-xs px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded border border-blue-800">
                            {conn.voltage}
                          </span>
                        )}
                        {conn.signalType && (
                          <span className="text-xs px-2 py-0.5 bg-green-900/30 text-green-400 rounded border border-green-800">
                            {conn.signalType.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default WiringDetails;

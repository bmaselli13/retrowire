import { useState } from 'react';
import { useStore } from './store';
import { FileDown, FileImage, Trash2, FileText, Zap, Keyboard, Home, LogOut, User } from 'lucide-react';
import { exportToPNG, exportToPDF, generateBOM, downloadBOMAsText } from './utils/export';
import { autoWireComponents } from './utils/autoWire';
import { ComponentDefinition } from './types';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAuth } from './firebase/AuthContext';
import toast from 'react-hot-toast';

function Toolbar() {
  const { nodes, edges, clearCanvas, projectName, preferredVoltage, setPreferredVoltage } = useStore();
  const [showBOM, setShowBOM] = useState(false);
  const [showAutoWireLog, setShowAutoWireLog] = useState(false);
  const [autoWireLog, setAutoWireLog] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isAutoWiring, setIsAutoWiring] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      await exportToPNG('canvas', nodes, edges, `${projectName}.png`);
      toast.success('Exported PNG and Connection Guide successfully!');
    } catch (error) {
      console.error('PNG export error:', error);
      toast.error('Failed to export PNG');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('canvas', nodes, edges, `${projectName}.pdf`);
      toast.success('Exported PDF and Connection Guide successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearCanvas = () => {
    if (nodes.length === 0) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to clear the canvas? This will remove all components and wires.'
    );
    
    if (confirmed) {
      clearCanvas();
      toast.success('Canvas cleared');
    }
  };

  const handleViewBOM = () => {
    setShowBOM(!showBOM);
  };

  const handleDownloadBOM = () => {
    const bom = generateBOM(nodes, edges);
    downloadBOMAsText(bom, `${projectName}-bom.txt`);
    toast.success('BOM downloaded!');
  };

  const handleAutoWire = () => {
    if (nodes.length === 0) {
      toast.error('Add components to the canvas first');
      return;
    }

    setIsAutoWiring(true);
    
    try {
      const { edges: newEdges, log, nodes: arrangedNodes } = autoWireComponents(nodes, edges, preferredVoltage);
      
      if (newEdges.length === 0) {
        toast.error('Could not create any connections');
        setAutoWireLog(log);
        setShowAutoWireLog(true);
        return;
      }

      // Validate edges before adding them - ensure all handles exist on their nodes
      const validEdges = newEdges.filter(edge => {
        const sourceNode = arrangedNodes.find(n => n.id === edge.source);
        const targetNode = arrangedNodes.find(n => n.id === edge.target);
        
        if (!sourceNode || !targetNode) {
          console.warn(`Edge ${edge.id}: Missing node`);
          return false;
        }
        
        // Type-safe access to component data
        const sourceData = sourceNode.data as { component?: ComponentDefinition };
        const targetData = targetNode.data as { component?: ComponentDefinition };
        
        const sourceComp = sourceData?.component;
        const targetComp = targetData?.component;
        
        if (!sourceComp || !targetComp) {
          console.warn(`Edge ${edge.id}: Missing component data`);
          return false;
        }
        
        const sourceHandleExists = sourceComp.ports?.some(p => p.id === edge.sourceHandle);
        const targetHandleExists = targetComp.ports?.some(p => p.id === edge.targetHandle);
        
        if (!sourceHandleExists) {
          console.warn(`Edge ${edge.id}: Source handle "${edge.sourceHandle}" not found on ${sourceComp.name}`);
          return false;
        }
        
        if (!targetHandleExists) {
          console.warn(`Edge ${edge.id}: Target handle "${edge.targetHandle}" not found on ${targetComp.name}`);
          return false;
        }
        
        return true;
      });

      if (validEdges.length === 0) {
        toast.error('No valid connections could be created');
        setAutoWireLog(log);
        setShowAutoWireLog(true);
        return;
      }

      if (validEdges.length < newEdges.length) {
        console.warn(`Filtered out ${newEdges.length - validEdges.length} invalid edges`);
      }

      // Update nodes first to ensure they're rendered with their handles
      useStore.getState().setNodes(arrangedNodes);
      
      // Wait for React Flow to render the nodes with all their handles
      // This prevents "Couldn't create edge" errors
      // Using requestAnimationFrame ensures DOM is updated before adding edges
      requestAnimationFrame(() => {
        setTimeout(() => {
          useStore.getState().setEdges([...edges, ...validEdges]);
          setAutoWireLog(log);
          setShowAutoWireLog(true);
          setIsAutoWiring(false);
          toast.success(`Created ${validEdges.length} connections and arranged layout!`);
        }, 200);
      });
    } catch (error) {
      console.error('Auto-wire error:', error);
      toast.error('Auto-wire failed. Check console for details.');
      setIsAutoWiring(false);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'e',
      ctrl: true,
      callback: () => nodes.length > 0 && !isExporting && handleExportPNG(),
      description: 'Export as PNG',
    },
    {
      key: 'p',
      ctrl: true,
      shift: true,
      callback: () => nodes.length > 0 && !isExporting && handleExportPDF(),
      description: 'Export as PDF',
    },
    {
      key: 'w',
      ctrl: true,
      callback: () => nodes.length > 0 && !isAutoWiring && handleAutoWire(),
      description: 'Auto-wire components',
    },
    {
      key: 'b',
      ctrl: true,
      callback: () => nodes.length > 0 && handleViewBOM(),
      description: 'View bill of materials',
    },
    {
      key: 'k',
      ctrl: true,
      shift: true,
      callback: handleClearCanvas,
      description: 'Clear canvas',
    },
    {
      key: '?',
      shift: true,
      callback: () => setShowKeyboardHelp(true),
      description: 'Show keyboard shortcuts',
    },
  ]);

  const bom = generateBOM(nodes, edges);

  return (
    <>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {/* Home Button */}
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-lg transition-colors"
          title="Back to Home"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </button>
        
        {/* Voltage Selector */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg shadow-lg">
          <span className="text-white text-sm font-medium">Circuit:</span>
          <select
            value={preferredVoltage}
            onChange={(e) => setPreferredVoltage(e.target.value as '5V' | '12V')}
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="5V">5V</option>
            <option value="12V">12V</option>
          </select>
        </div>
        <button
          onClick={handleExportPNG}
          disabled={nodes.length === 0 || isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg shadow-lg transition-colors"
          title="Export as PNG"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Exporting...</span>
            </>
          ) : (
            <>
              <FileImage className="w-4 h-4" />
              <span className="hidden sm:inline">PNG</span>
            </>
          )}
        </button>

        <button
          onClick={handleExportPDF}
          disabled={nodes.length === 0 || isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg shadow-lg transition-colors"
          title="Export as PDF"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Exporting...</span>
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </>
          )}
        </button>

        <button
          onClick={handleViewBOM}
          disabled={nodes.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg shadow-lg transition-colors"
          title="View Bill of Materials"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">BOM</span>
        </button>

        <button
          onClick={handleAutoWire}
          disabled={nodes.length === 0 || isAutoWiring}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg shadow-lg transition-colors"
          title="Auto-Wire Components"
        >
          {isAutoWiring ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Wiring...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Auto-Wire</span>
            </>
          )}
        </button>

        <button
          onClick={handleClearCanvas}
          disabled={nodes.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg shadow-lg transition-colors"
          title="Clear Canvas"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>

        <button
          onClick={() => setShowKeyboardHelp(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-lg transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* User Profile / Logout */}
        {user && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg shadow-lg">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm hidden lg:inline max-w-[120px] truncate">
              {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="ml-2 p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* BOM Modal */}
      {showBOM && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Bill of Materials
              </h2>
              <button
                onClick={() => setShowBOM(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {bom.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No components added yet. Add components to see the bill of materials.
                </p>
              ) : (
                <div className="space-y-6">
                  {['controller', 'input', 'power', 'output', 'display', 'wiring'].map(category => {
                    const items = bom.filter(item => item.category === category);
                    if (items.length === 0) return null;

                    return (
                      <div key={category}>
                        <h3 className="text-lg font-semibold text-white mb-3 capitalize border-b border-gray-700 pb-2">
                          {category}
                        </h3>
                        <div className="space-y-2">
                          {items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-gray-900 rounded p-3"
                            >
                              <div className="flex-1">
                                <p className="text-white font-medium">{item.name}</p>
                                {item.ports > 0 && (
                                  <p className="text-xs text-gray-400">{item.ports} ports</p>
                                )}
                              </div>
                              <div className="text-blue-400 font-bold text-lg">
                                {item.quantity}x
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-300">Total Components:</span>
                      <span className="text-white font-bold">
                        {bom.filter(i => i.category !== 'wiring').reduce((sum, i) => sum + i.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-blue-300">Total Wires:</span>
                      <span className="text-white font-bold">
                        {bom.find(i => i.category === 'wiring')?.quantity || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-700 flex gap-3">
              <button
                onClick={handleDownloadBOM}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FileDown className="w-4 h-4" />
                Download as Text
              </button>
              <button
                onClick={() => setShowBOM(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Wire Log Modal */}
      {showAutoWireLog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-purple-400" />
                Auto-Wiring Results
              </h2>
              <button
                onClick={() => setShowAutoWireLog(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                {autoWireLog.map((line, idx) => (
                  <div
                    key={idx}
                    className={`${
                      line.startsWith('✅') || line.includes('✓')
                        ? 'text-green-400'
                        : line.startsWith('⚠️') || line.startsWith('❌')
                        ? 'text-yellow-400'
                        : line.startsWith('🤖') || line.startsWith('📊') || line.startsWith('⚡') || line.startsWith('🎮') || line.startsWith('📺') || line.startsWith('🖥️') || line.startsWith('🔌')
                        ? 'text-blue-400 font-bold'
                        : 'text-gray-300'
                    }`}
                  >
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
                <p className="text-sm text-purple-300">
                  💡 <strong>Tip:</strong> The auto-wiring agent analyzes your components and creates connections based on electronics engineering best practices. Review the connections and adjust as needed!
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700">
              <button
                onClick={() => setShowAutoWireLog(false)}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help Modal */}
      {showKeyboardHelp && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Keyboard className="w-6 h-6" />
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">Export as PNG</span>
                <kbd className="px-2 py-1 bg-gray-700 text-white rounded text-sm font-mono">Ctrl+E</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">Export as PDF</span>
                <kbd className="px-2 py-1 bg-gray-700 text-white rounded text-sm font-mono">Ctrl+Shift+P</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">Auto-wire</span>
                <kbd className="px-2 py-1 bg-gray-700 text-white rounded text-sm font-mono">Ctrl+W</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">View BOM</span>
                <kbd className="px-2 py-1 bg-gray-700 text-white rounded text-sm font-mono">Ctrl+B</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">Clear canvas</span>
                <kbd className="px-2 py-1 bg-gray-700 text-white rounded text-sm font-mono">Ctrl+Shift+K</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">Delete selected</span>
                <kbd className="px-2 py-1 bg-gray-700 text-white rounded text-sm font-mono">Delete</kbd>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-300">Show this help</span>
                <kbd className="px-2 py-1 bg-gray-700 text-white rounded text-sm font-mono">?</kbd>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 bg-blue-900/20">
              <p className="text-sm text-blue-300">
                💡 <strong>Tip:</strong> Use <kbd className="px-1 py-0.5 bg-gray-700 text-white rounded text-xs">Cmd</kbd> instead of <kbd className="px-1 py-0.5 bg-gray-700 text-white rounded text-xs">Ctrl</kbd> on Mac
              </p>
            </div>

            <div className="p-6 border-t border-gray-700">
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Toolbar;

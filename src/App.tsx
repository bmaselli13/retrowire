import { useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  OnConnect,
  Connection,
  addEdge,
  NodeTypes,
  EdgeTypes,
} from '@xyflow/react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

import { useStore } from './store';
import ComponentNode from './ComponentNode';
import CustomEdge from './CustomEdge';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import WiringDetails from './WiringDetails';
import { ComponentDefinition } from './types';
import { getPortFromNode, validateConnection, determineEdgeColor } from './utils/validation';

// Define custom node and edge types
const nodeTypes = {
  component: ComponentNode,
} as NodeTypes;

const edgeTypes = {
  custom: CustomEdge,
} as EdgeTypes;

function App() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, addNode, setEdges, wiringDetailsOpen, setWiringDetailsOpen } = useStore();
  
  // Use ref for node ID counter (React-safe, no global mutable state)
  const nodeIdRef = useRef(0);
  
  // Initialize node ID counter based on existing nodes
  useEffect(() => {
    if (nodes.length > 0) {
      const maxId = nodes.reduce((max, node) => {
        const match = node.id.match(/node_(\d+)/);
        if (match) {
          const id = parseInt(match[1]);
          return id > max ? id : max;
        }
        return max;
      }, 0);
      nodeIdRef.current = maxId + 1;
    }
  }, [nodes]); // ✅ Include nodes dependency
  
  // Getter function for unique node IDs
  const getId = useCallback(() => `node_${nodeIdRef.current++}`, []);

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) {
        return;
      }

      // Check for duplicate edge
      const edgeExists = edges.some(e => 
        e.source === connection.source &&
        e.target === connection.target &&
        e.sourceHandle === connection.sourceHandle &&
        e.targetHandle === connection.targetHandle
      );

      if (edgeExists) {
        toast.error('Connection already exists between these ports');
        return;
      }

      // Get ports for validation
      const sourcePort = getPortFromNode(nodes, connection.source, connection.sourceHandle);
      const targetPort = getPortFromNode(nodes, connection.target, connection.targetHandle);

      if (!sourcePort || !targetPort) {
        toast.error('Invalid connection: Could not find port information');
        return;
      }

      // Validate connection
      const validation = validateConnection(sourcePort, targetPort);

      if (!validation.valid) {
        toast.error(validation.error || 'Invalid connection');
        return;
      }

      if (validation.warning) {
        toast(validation.warning, {
          icon: '⚠️',
          duration: 5000,
        });
      }

      // Determine wire color based on source port
      const wireColor = determineEdgeColor(nodes, connection.source, connection.sourceHandle);

      // Create edge with custom styling
      const newEdge = addEdge({
        ...connection,
        id: `edge-${Date.now()}`,
        type: 'custom',
        data: {
          color: wireColor,
          strokeWidth: 3,
          label: sourcePort.voltage || sourcePort.type,
        },
      }, edges);

      setEdges(newEdge);
      
      if (!validation.warning) {
        toast.success('Connection created');
      }
    },
    [edges, setEdges, nodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const componentData = event.dataTransfer.getData('application/reactflow');
      if (!componentData) return;

      const component: ComponentDefinition = JSON.parse(componentData);

      // Calculate position relative to the canvas
      const position = {
        x: event.clientX - reactFlowBounds.left - component.width / 2,
        y: event.clientY - reactFlowBounds.top - component.height / 2,
      };

      const newNode = {
        id: getId(),
        type: 'component',
        position,
        data: { component },
      };

      addNode(newNode);
    },
    [addNode]
  );

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Sidebar />
      
      <WiringDetails 
        isOpen={wiringDetailsOpen}
        onToggle={() => setWiringDetailsOpen(!wiringDetailsOpen)}
      />
      
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          attributionPosition="bottom-right"
          className="bg-gray-950"
          deleteKeyCode="Delete"
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            color="#374151"
          />
          <Controls className="bg-gray-800 border border-gray-700" />
          <MiniMap 
            className="bg-gray-800 border border-gray-700"
            nodeColor="#3b82f6"
            maskColor="rgba(0, 0, 0, 0.6)"
          />
        </ReactFlow>

        <Toolbar />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-gray-900 to-transparent pointer-events-none">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-500">⚡</span>
              RetroWire
              <span className="text-sm font-normal text-gray-400 ml-2">
                Visual Electronics Wiring for Makers
              </span>
            </h1>
          </div>
        </div>

        {/* Instructions */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg p-8 max-w-md text-center">
              <div className="text-4xl mb-4">🎮</div>
              <h2 className="text-xl font-bold mb-2">Welcome to RetroWire</h2>
              <p className="text-gray-300 text-sm">
                Drag components from the sidebar onto the canvas to start building your wiring diagram.
                Connect components by dragging between their ports.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

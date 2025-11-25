import { create } from 'zustand';
import { Node, Edge, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

const STORAGE_KEY = 'retrowire-project';

interface ProjectData {
  nodes: Node[];
  edges: Edge[];
  name?: string;
  lastSaved?: number;
  preferredVoltage?: '5V' | '12V';
}

interface StoreState {
  nodes: Node[];
  edges: Edge[];
  projectName: string;
  preferredVoltage: '5V' | '12V';
  wiringDetailsOpen: boolean;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: (node: Node) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  saveProject: () => void;
  loadProject: () => void;
  clearCanvas: () => void;
  setProjectName: (name: string) => void;
  setPreferredVoltage: (voltage: '5V' | '12V') => void;
  setWiringDetailsOpen: (open: boolean) => void;
}

// Load project from localStorage
const loadFromStorage = (): ProjectData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load project:', error);
    return null;
  }
};

// Save project to localStorage
const saveToStorage = (data: ProjectData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save project:', error);
  }
};

export const useStore = create<StoreState>((set, get) => {
  // Initialize from localStorage if available
  const savedProject = loadFromStorage();
  
  return {
    nodes: savedProject?.nodes || [],
    edges: savedProject?.edges || [],
    projectName: savedProject?.name || 'Untitled Project',
    preferredVoltage: savedProject?.preferredVoltage || '5V',
    wiringDetailsOpen: false,
    
    onNodesChange: (changes) => {
      const newNodes = applyNodeChanges(changes, get().nodes);
      set({ nodes: newNodes });
      
      // Auto-save after changes
      setTimeout(() => {
        get().saveProject();
      }, 1000);
    },
    
    onEdgesChange: (changes) => {
      const newEdges = applyEdgeChanges(changes, get().edges);
      set({ edges: newEdges });
      
      // Auto-save after changes
      setTimeout(() => {
        get().saveProject();
      }, 1000);
    },
    
    addNode: (node) => {
      set({ nodes: [...get().nodes, node] });
      get().saveProject();
    },
    
    setNodes: (nodes) => {
      // Deduplicate nodes by ID to prevent React key warnings
      const seenIds = new Set<string>();
      const uniqueNodes = nodes.filter(node => {
        if (seenIds.has(node.id)) {
          console.warn(`Filtering out duplicate node with id: ${node.id}`);
          return false;
        }
        seenIds.add(node.id);
        return true;
      });
      
      set({ nodes: uniqueNodes });
      get().saveProject();
    },
    
    setEdges: (edges) => {
      // Deduplicate edges by ID to prevent React key warnings
      const seenIds = new Set<string>();
      const uniqueEdges = edges.filter(edge => {
        if (seenIds.has(edge.id)) {
          console.warn(`Filtering out duplicate edge with id: ${edge.id}`);
          return false;
        }
        seenIds.add(edge.id);
        return true;
      });
      
      set({ edges: uniqueEdges });
      get().saveProject();
    },
    
    saveProject: () => {
      const { nodes, edges, projectName, preferredVoltage } = get();
      saveToStorage({
        nodes,
        edges,
        name: projectName,
        preferredVoltage,
        lastSaved: Date.now(),
      });
    },
    
    loadProject: () => {
      const savedProject = loadFromStorage();
      if (savedProject) {
        set({
          nodes: savedProject.nodes || [],
          edges: savedProject.edges || [],
          projectName: savedProject.name || 'Untitled Project',
          preferredVoltage: savedProject.preferredVoltage || '5V',
        });
      }
    },
    
    clearCanvas: () => {
      set({ nodes: [], edges: [] });
      get().saveProject();
    },
    
    setProjectName: (name: string) => {
      set({ projectName: name });
      get().saveProject();
    },
    
    setPreferredVoltage: (voltage: '5V' | '12V') => {
      set({ preferredVoltage: voltage });
      get().saveProject();
    },
    
    setWiringDetailsOpen: (open: boolean) => {
      set({ wiringDetailsOpen: open });
    },
  };
});

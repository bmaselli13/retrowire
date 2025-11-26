import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { Node, Edge } from '@xyflow/react';
import {
  getUserProjects,
  getSharedProjects,
  createProject as createProjectService,
  getProject,
  saveProject as saveProjectService,
  deleteProject as deleteProjectService,
  duplicateProject as duplicateProjectService,
  updateProjectMetadata,
  canAccessProject,
} from '../firebase/projectService';
import { canCreateProject } from '../firebase/userService';
import { ProjectMetadata, ProjectData } from '../types/user';

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [sharedProjects, setSharedProjects] = useState<ProjectMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user's projects and shared projects
  const loadProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setSharedProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load owned projects and shared projects in parallel
      const [ownedProjects, shared] = await Promise.all([
        getUserProjects(user.uid),
        getSharedProjects(user.email!),
      ]);

      setProjects(ownedProjects);
      setSharedProjects(shared);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load projects on mount and when user changes
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Create a new project
  const createProject = async (name: string, description?: string): Promise<ProjectData> => {
    if (!user) throw new Error('No user logged in');

    // Check project limit
    const canCreate = await canCreateProject(user.uid, projects.length);
    if (!canCreate) {
      throw new Error('Project limit reached. Upgrade to Pro for unlimited projects.');
    }

    try {
      const newProject = await createProjectService(user.uid, name, description);
      
      // Reload projects to include new one
      await loadProjects();
      
      return newProject;
    } catch (err: any) {
      console.error('Error creating project:', err);
      throw err;
    }
  };

  // Load a specific project
  const loadProject = async (projectId: string): Promise<ProjectData | null> => {
    if (!user) throw new Error('No user logged in');

    try {
      // Check if user can access this project
      const hasAccess = await canAccessProject(projectId, user.uid, user.email!);
      if (!hasAccess) {
        throw new Error('You do not have permission to access this project');
      }

      const project = await getProject(projectId);
      return project;
    } catch (err: any) {
      console.error('Error loading project:', err);
      throw err;
    }
  };

  // Save project
  const saveProject = async (
    projectId: string,
    nodes: Node[],
    edges: Edge[],
    preferredVoltage?: '5V' | '12V',
    thumbnail?: string
  ): Promise<void> => {
    if (!user) throw new Error('No user logged in');

    try {
      await saveProjectService(projectId, nodes, edges, preferredVoltage, thumbnail);
      
      // Update the project in local state
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, updatedAt: new Date() as any }
            : p
        )
      );
    } catch (err: any) {
      console.error('Error saving project:', err);
      throw err;
    }
  };

  // Rename project
  const renameProject = async (projectId: string, newName: string): Promise<void> => {
    if (!user) throw new Error('No user logged in');

    try {
      await updateProjectMetadata(projectId, { name: newName });
      
      // Update local state
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, name: newName } : p
        )
      );
    } catch (err: any) {
      console.error('Error renaming project:', err);
      throw err;
    }
  };

  // Delete project
  const deleteProject = async (projectId: string): Promise<void> => {
    if (!user) throw new Error('No user logged in');

    try {
      await deleteProjectService(projectId, user.uid);
      
      // Remove from local state
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err: any) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  // Duplicate project
  const duplicateProject = async (projectId: string, newName?: string): Promise<ProjectData> => {
    if (!user) throw new Error('No user logged in');

    // Check project limit
    const canCreate = await canCreateProject(user.uid, projects.length);
    if (!canCreate) {
      throw new Error('Project limit reached. Upgrade to Pro for unlimited projects.');
    }

    try {
      const duplicate = await duplicateProjectService(projectId, user.uid, newName);
      
      // Reload projects
      await loadProjects();
      
      return duplicate;
    } catch (err: any) {
      console.error('Error duplicating project:', err);
      throw err;
    }
  };

  return {
    projects,
    sharedProjects,
    loading,
    error,
    createProject,
    loadProject,
    saveProject,
    renameProject,
    deleteProject,
    duplicateProject,
    refreshProjects: loadProjects,
  };
}

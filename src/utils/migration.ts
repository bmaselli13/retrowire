import { Node, Edge } from '@xyflow/react';
import { createProject } from '../firebase/projectService';

const STORAGE_KEY = 'retrowire-project';

interface LocalStorageProject {
  nodes: Node[];
  edges: Edge[];
  name?: string;
  lastSaved?: number;
  preferredVoltage?: '5V' | '12V';
}

/**
 * Check if there's a project in localStorage
 */
export function hasLocalStorageProject(): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return false;
    
    const project = JSON.parse(data) as LocalStorageProject;
    
    // Check if project has any actual content
    return (project.nodes && project.nodes.length > 0) || 
           (project.edges && project.edges.length > 0);
  } catch (error) {
    console.error('Error checking localStorage:', error);
    return false;
  }
}

/**
 * Get project from localStorage
 */
export function getLocalStorageProject(): LocalStorageProject | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    return JSON.parse(data) as LocalStorageProject;
  } catch (error) {
    console.error('Error reading localStorage:', error);
    return null;
  }
}

/**
 * Migrate localStorage project to Firestore
 */
export async function migrateLocalStorageProject(userId: string): Promise<string | null> {
  const localProject = getLocalStorageProject();
  
  if (!localProject) {
    return null;
  }
  
  try {
    // Create project in Firestore with localStorage data
    const projectName = localProject.name || 'Migrated Project';
    const newProject = await createProject(userId, projectName, 'Migrated from local storage');
    
    // Update project with actual data
    const projectRef = await import('../firebase/firestore').then(m => m.db);
    const { doc, updateDoc } = await import('firebase/firestore');
    
    await updateDoc(doc(projectRef, 'projects', newProject.id), {
      nodes: localProject.nodes || [],
      edges: localProject.edges || [],
      preferredVoltage: localProject.preferredVoltage || '5V',
    });
    
    return newProject.id;
  } catch (error) {
    console.error('Error migrating project:', error);
    throw error;
  }
}

/**
 * Clear localStorage project after successful migration
 */
export function clearLocalStorageProject(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Check if migration has been completed
 */
export function hasMigrationCompleted(userId: string): boolean {
  try {
    const migrationKey = `migration-complete-${userId}`;
    return localStorage.getItem(migrationKey) === 'true';
  } catch (error) {
    return false;
  }
}

/**
 * Mark migration as completed
 */
export function markMigrationCompleted(userId: string): void {
  try {
    const migrationKey = `migration-complete-${userId}`;
    localStorage.setItem(migrationKey, 'true');
  } catch (error) {
    console.error('Error marking migration complete:', error);
  }
}

/**
 * Get migration prompt status for user
 */
export function shouldPromptMigration(userId: string): boolean {
  return hasLocalStorageProject() && !hasMigrationCompleted(userId);
}

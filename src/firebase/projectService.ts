import { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { Node, Edge } from '@xyflow/react';
import { db, COLLECTIONS } from './firestore';
import { ProjectData, ProjectMetadata } from '../types/user';
import { deleteProjectThumbnail } from './storageService';

/**
 * Create a new project
 */
export async function createProject(
  userId: string,
  name: string,
  description?: string
): Promise<ProjectData> {
  // Generate unique project ID
  const projectRef = doc(collection(db, COLLECTIONS.PROJECTS));
  
  const project: ProjectData = {
    id: projectRef.id,
    userId,
    name,
    description,
    nodes: [],
    edges: [],
    preferredVoltage: '5V',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isPublic: false,
    sharedWith: [],
  };
  
  await setDoc(projectRef, project);
  return project;
}

/**
 * Get a single project by ID
 */
export async function getProject(projectId: string): Promise<ProjectData | null> {
  const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
  const projectSnap = await getDoc(projectRef);
  
  if (!projectSnap.exists()) {
    return null;
  }
  
  return projectSnap.data() as ProjectData;
}

/**
 * Get all projects for a user
 */
export async function getUserProjects(userId: string): Promise<ProjectMetadata[]> {
  const projectsRef = collection(db, COLLECTIONS.PROJECTS);
  const q = query(
    projectsRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const projects: ProjectMetadata[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data() as ProjectData;
    // Return metadata only (without nodes/edges for performance)
    const { nodes, edges, ...metadata } = data;
    projects.push(metadata);
  });
  
  return projects;
}

/**
 * Get projects shared with user
 */
export async function getSharedProjects(userEmail: string): Promise<ProjectMetadata[]> {
  const projectsRef = collection(db, COLLECTIONS.PROJECTS);
  const q = query(
    projectsRef,
    where('sharedWith', 'array-contains', userEmail),
    orderBy('updatedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const projects: ProjectMetadata[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data() as ProjectData;
    const { nodes, edges, ...metadata } = data;
    projects.push(metadata);
  });
  
  return projects;
}

/**
 * Save project (update nodes and edges)
 */
export async function saveProject(
  projectId: string,
  nodes: Node[],
  edges: Edge[],
  preferredVoltage?: '5V' | '12V',
  thumbnail?: string
): Promise<void> {
  const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
  
  const updates: any = {
    nodes,
    edges,
    updatedAt: serverTimestamp(),
  };
  
  if (preferredVoltage) {
    updates.preferredVoltage = preferredVoltage;
  }
  
  if (thumbnail) {
    updates.thumbnail = thumbnail;
  }
  
  await updateDoc(projectRef, updates);
}

/**
 * Update project metadata (name, description, etc.)
 */
export async function updateProjectMetadata(
  projectId: string,
  updates: {
    name?: string;
    description?: string;
    preferredVoltage?: '5V' | '12V';
    thumbnail?: string;
  }
): Promise<void> {
  const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
  
  await updateDoc(projectRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string, userId: string): Promise<void> {
  const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
  
  // Delete thumbnail from storage
  try {
    await deleteProjectThumbnail(userId, projectId);
  } catch (error) {
    console.error('Failed to delete project thumbnail:', error);
  }
  
  // Delete project document
  await deleteDoc(projectRef);
}

/**
 * Duplicate a project
 */
export async function duplicateProject(
  projectId: string,
  userId: string,
  newName?: string
): Promise<ProjectData> {
  // Get original project
  const original = await getProject(projectId);
  
  if (!original) {
    throw new Error('Project not found');
  }
  
  // Create new project with copied data
  const projectRef = doc(collection(db, COLLECTIONS.PROJECTS));
  
  const duplicate: ProjectData = {
    ...original,
    id: projectRef.id,
    userId, // New owner
    name: newName || `${original.name} (Copy)`,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isPublic: false, // Duplicates are private by default
    sharedWith: [], // Don't copy shares
    shareLink: undefined,
  };
  
  await setDoc(projectRef, duplicate);
  return duplicate;
}

/**
 * Share project with users (via email)
 */
export async function shareProjectWithUsers(
  projectId: string,
  emails: string[]
): Promise<void> {
  const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
  const project = await getProject(projectId);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  // Add new emails to sharedWith array (avoid duplicates)
  const currentShared = project.sharedWith || [];
  const newShared = [...new Set([...currentShared, ...emails])];
  
  await updateDoc(projectRef, {
    sharedWith: newShared,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Remove user from project sharing
 */
export async function unshareProjectWithUser(
  projectId: string,
  email: string
): Promise<void> {
  const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
  const project = await getProject(projectId);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  const newShared = project.sharedWith.filter(e => e !== email);
  
  await updateDoc(projectRef, {
    sharedWith: newShared,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Toggle project public/private
 */
export async function toggleProjectPublic(projectId: string): Promise<boolean> {
  const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
  const project = await getProject(projectId);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  const newPublicState = !project.isPublic;
  
  await updateDoc(projectRef, {
    isPublic: newPublicState,
    shareLink: newPublicState ? projectId : undefined, // Use project ID as share link
    updatedAt: serverTimestamp(),
  });
  
  return newPublicState;
}

/**
 * Delete all projects owned by a user (utility for account deletion)
 */
export async function deleteAllUserProjects(userId: string): Promise<void> {
  const projectsRef = collection(db, COLLECTIONS.PROJECTS);
  const q = query(projectsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);

  const deletes: Promise<void>[] = [];
  snapshot.forEach((docSnap) => {
    deletes.push(deleteProject(docSnap.id, userId));
  });

  await Promise.all(deletes);
}

/**
 * Get recent projects (up to 5)
 */
export async function getRecentProjects(userId: string): Promise<ProjectMetadata[]> {
  const projectsRef = collection(db, COLLECTIONS.PROJECTS);
  const q = query(
    projectsRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(5)
  );
  
  const querySnapshot = await getDocs(q);
  const projects: ProjectMetadata[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data() as ProjectData;
    const { nodes, edges, ...metadata } = data;
    projects.push(metadata);
  });
  
  return projects;
}

/**
 * Check if user can access project (owns it, it's public, or shared with them)
 */
export async function canAccessProject(
  projectId: string,
  userId: string,
  userEmail: string
): Promise<boolean> {
  const project = await getProject(projectId);
  
  if (!project) return false;
  
  // Owner can always access
  if (project.userId === userId) return true;
  
  // Public projects are accessible
  if (project.isPublic) return true;
  
  // Check if shared with user
  if (project.sharedWith.includes(userEmail)) return true;
  
  return false;
}

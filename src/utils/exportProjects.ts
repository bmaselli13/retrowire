import JSZip from 'jszip';
import { getUserProjects, getProject } from '../firebase/projectService';
import { getUserProfile } from '../firebase/userService';
import type { ProjectData, ProjectMetadata, UserProfile } from '../types/user';

/**
 * Export all of a user's projects and profile to a ZIP file.
 * - Creates a manifest.json with summary data
 * - Exports user profile as user.json
 * - Exports each project as projects/{sanitized-name}-{id}.json
 * - Saves project thumbnail (if available) as projects/{id}/thumbnail.{ext}
 */
export async function exportUserProjects(userId: string): Promise<void> {
  const zip = new JSZip();

  // Load user profile
  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new Error('User profile not found');
  }

  // Load owned project metadata
  const projectMetas: ProjectMetadata[] = await getUserProjects(userId);

  // Fetch full project data (nodes/edges) for each
  const projects: ProjectData[] = [];
  for (const meta of projectMetas) {
    const full = await getProject(meta.id);
    if (full) {
      projects.push(full);
    }
  }

  // Add user profile
  zip.file('user.json', prettyJson(profile));

  // Add projects
  const projectsFolder = zip.folder('projects');
  if (!projectsFolder) {
    throw new Error('Failed to create projects folder in ZIP');
  }

  for (const project of projects) {
    const safeName = sanitizeFilename(project.name);
    const base = `${safeName}-${project.id}`;

    // Project JSON (without large base64 thumbnail duplication)
    const { thumbnail, ...rest } = project as any;
    projectsFolder.file(`${base}.json`, prettyJson(rest));

    // Save thumbnail (if present)
    if (typeof thumbnail === 'string' && thumbnail.startsWith('data:')) {
      const { ext, base64 } = splitDataUrl(thumbnail);
      // Save under a nested folder for this project
      const pFolder = projectsFolder.folder(project.id);
      if (pFolder) {
        pFolder.file(`thumbnail.${ext}`, base64, { base64: true });
      }
    }
  }

  // Manifest
  const manifest = buildManifest(profile, projects, projectMetas);
  zip.file('manifest.json', prettyJson(manifest));

  // Generate ZIP and download
  const blob = await zip.generateAsync({ type: 'blob' });
  const filename = `retrowire-backup-${timestamp()}.zip`;
  downloadBlob(blob, filename);
}

/**
 * Manifest structure for backup metadata
 */
function buildManifest(
  profile: UserProfile,
  projects: ProjectData[],
  metas: ProjectMetadata[]
) {
  return {
    app: 'RetroWire',
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    user: {
      uid: profile.uid,
      email: profile.email,
      displayName: profile.displayName,
      subscription: profile.subscription,
      preferences: profile.preferences,
      createdAt: dateFromTimestamp(profile.createdAt)?.toISOString(),
      lastLogin: dateFromTimestamp(profile.lastLogin)?.toISOString(),
    },
    projects: projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || null,
      preferredVoltage: p.preferredVoltage,
      nodeCount: p.nodes?.length || 0,
      edgeCount: p.edges?.length || 0,
      isPublic: p.isPublic,
      sharedWith: p.sharedWith || [],
      createdAt: dateFromTimestamp(p.createdAt)?.toISOString(),
      updatedAt: dateFromTimestamp(p.updatedAt)?.toISOString(),
      hasThumbnail: Boolean((p as any).thumbnail),
    })),
    counts: {
      projects: projects.length,
      sharedProjects: metas.filter((m) => (m.sharedWith || []).length > 0).length,
      publicProjects: metas.filter((m) => m.isPublic).length,
      totalNodes: projects.reduce((sum, p) => sum + (p.nodes?.length || 0), 0),
      totalEdges: projects.reduce((sum, p) => sum + (p.edges?.length || 0), 0),
    },
  };
}

function prettyJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

function sanitizeFilename(name: string): string {
  return name
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-') // illegal filename chars
    .replace(/\s+/g, '_')
    .slice(0, 100);
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

/**
 * Given a data URL, returns file extension and base64 content
 */
function splitDataUrl(dataUrl: string): { ext: string; base64: string } {
  // Example: data:image/jpeg;base64,/9j/4AAQSk...
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) {
    return { ext: 'bin', base64: '' };
  }
  const mime = match[1];
  const base64 = match[2];
  const ext = mimeToExt(mime);
  return { ext, base64 };
}

function mimeToExt(mime: string): string {
  if (mime.includes('image/png')) return 'png';
  if (mime.includes('image/jpeg') || mime.includes('image/jpg')) return 'jpg';
  if (mime.includes('image/webp')) return 'webp';
  if (mime.includes('image/svg+xml')) return 'svg';
  return 'bin';
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Firestore Timestamp helper
function dateFromTimestamp(ts: any): Date | null {
  try {
    return ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  } catch {
    return null;
  }
}

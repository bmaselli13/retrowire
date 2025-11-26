import { useEffect, useMemo, useRef, useState } from 'react';
import { useUserProfile } from './useUserProfile';
import { useProjects } from './useProjects';
import { useStore } from '../store';
import { getProject } from '../firebase/projectService';

export type SaveStatus = 'idle' | 'off' | 'saving' | 'saved' | 'error' | 'conflict';

interface UseAutoSaveResult {
  status: SaveStatus;
  lastSavedAt: number | null;
  enabled: boolean;
  intervalSec: number;
}

/**
 * Cloud auto-save hook
 * - Reads nodes/edges/preferredVoltage from global store
 * - Reads autoSave preferences from user profile
 * - Debounces and persists to Firestore using useProjects.saveProject
 */
export function useAutoSave(projectId?: string | null): UseAutoSaveResult {
  const { profile } = useUserProfile();
  const { saveProject } = useProjects();
  const { nodes, edges, preferredVoltage } = useStore();

  const enabled = profile?.preferences?.autoSave ?? true;
  const intervalSec = profile?.preferences?.autoSaveInterval ?? 3;

  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);
  const prevSigRef = useRef<string>('');

  // Signature of current project content to avoid redundant saves
  const contentSignature = useMemo(() => {
    try {
      return JSON.stringify({
        n: nodes?.map((n) => ({ id: n.id, p: n.position, d: n.data })), // reduce size
        e: edges?.map((e) => ({ s: e.source, t: e.target, sh: e.sourceHandle, th: e.targetHandle, d: e.data })),
        v: preferredVoltage,
      });
    } catch {
      // Fallback if serialization fails
      return `${nodes?.length || 0}:${edges?.length || 0}:${preferredVoltage}`;
    }
  }, [nodes, edges, preferredVoltage]);

  useEffect(() => {
    // Clear any pending timer on effect re-run/unmount
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!projectId) {
      return;
    }

    if (!enabled) {
      setStatus('off');
      return;
    }

    // If content signature didn't change, do nothing
    if (prevSigRef.current === contentSignature) {
      return;
    }

    // Schedule a debounced save
    setStatus((s) => (s === 'saving' ? s : 'idle'));
    timerRef.current = window.setTimeout(async () => {
      try {
        // Conflict check: if remote changed since our last save and differs from our content, signal conflict
        const remote = await getProject(projectId);
        const toDate = (ts: any) => (ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null);
        if (remote) {
          const remoteSig = JSON.stringify({
            n: (remote.nodes || []).map((n: any) => ({ id: n.id, p: n.position, d: n.data })),
            e: (remote.edges || []).map((e: any) => ({ s: e.source, t: e.target, sh: e.sourceHandle, th: e.targetHandle, d: e.data })),
            v: remote.preferredVoltage,
          });
          const remoteUpdatedAt = toDate((remote as any).updatedAt);
          if (remoteUpdatedAt && remoteUpdatedAt.getTime() > (lastSavedAt || 0) && remoteSig !== prevSigRef.current) {
            setStatus('conflict');
            timerRef.current = null;
            return;
          }
        }

        setStatus('saving');
        await saveProject(projectId, nodes, edges, preferredVoltage);
        prevSigRef.current = contentSignature;
        setLastSavedAt(Date.now());
        setStatus('saved');
      } catch (err) {
        console.error('Auto-save failed:', err);
        setStatus('error');
      } finally {
        timerRef.current = null;
      }
    }, Math.max(1, intervalSec) * 1000);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, contentSignature, enabled, intervalSec, saveProject]);

  return { status, lastSavedAt, enabled, intervalSec };
}

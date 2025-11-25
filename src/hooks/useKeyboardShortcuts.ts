import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[], enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        
        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
};

export const KEYBOARD_SHORTCUTS = {
  SAVE: { key: 's', ctrl: true, description: 'Save project' },
  EXPORT_PNG: { key: 'e', ctrl: true, description: 'Export as PNG' },
  EXPORT_PDF: { key: 'p', ctrl: true, shift: true, description: 'Export as PDF' },
  AUTO_WIRE: { key: 'w', ctrl: true, description: 'Auto-wire components' },
  CLEAR: { key: 'k', ctrl: true, shift: true, description: 'Clear canvas' },
  DELETE: { key: 'Delete', description: 'Delete selected' },
  HELP: { key: '?', shift: true, description: 'Show keyboard shortcuts' },
  BOM: { key: 'b', ctrl: true, description: 'View bill of materials' },
};

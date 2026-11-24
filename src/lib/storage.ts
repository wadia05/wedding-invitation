/**
 * Session-only preferences (language, music on/off). Nothing here identifies
 * the visitor and nothing leaves their browser. Storage may be unavailable
 * (private mode, in-app browsers), so every access is guarded.
 */

const PREFIX = 'rs-invitation:';

export function readSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(PREFIX + key, value);
  } catch {
    /* storage unavailable — preference simply isn't remembered */
  }
}

import type { ReactNode } from 'react';

/**
 * Keeps numbers such as “12 / 12 / 2026” or “17:00” in their natural
 * left-to-right order inside Arabic sentences.
 */
export function Ltr({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={className}>
      {children}
    </bdi>
  );
}

import { useInView } from 'framer-motion';
import { useRef, type RefObject } from 'react';

/**
 * Tracks whether an element is near the viewport, so decorative loops can be
 * paused while off screen. Returns a ref and a value for `data-animate`.
 */
export function useOnScreen<T extends Element = HTMLDivElement>(): [RefObject<T | null>, 'on' | 'off'] {
  const ref = useRef<T | null>(null);
  const inView = useInView(ref, { margin: '120px 0px 120px 0px' });
  return [ref, inView ? 'on' : 'off'];
}

import { createContext } from 'react';

/**
 * closed  → the invitation card is shown, waiting for the guest's tap
 * opening → the card is animating open
 * open    → the main invitation is fully revealed
 */
export type ExperiencePhase = 'closed' | 'opening' | 'open';

export const ExperienceContext = createContext<ExperiencePhase>('closed');

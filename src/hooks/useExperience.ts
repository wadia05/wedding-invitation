import { useContext } from 'react';
import { ExperienceContext, type ExperiencePhase } from '../context/ExperienceContext';

export function useExperience(): ExperiencePhase {
  return useContext(ExperienceContext);
}

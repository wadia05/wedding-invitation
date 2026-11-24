import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from './components/layout/Header';
import { MusicToggle } from './components/ui/MusicToggle';
import { ExperienceContext, type ExperiencePhase } from './context/ExperienceContext';
import { useLanguage } from './hooks/useLanguage';
import { useMusic } from './hooks/useMusic';
import { useScrollLock } from './hooks/useScrollLock';
import { AnnouncementSection } from './sections/AnnouncementSection';
import { CalendarSection } from './sections/CalendarSection';
import { ClosingSection } from './sections/ClosingSection';
import { CountdownSection } from './sections/CountdownSection';
import { EventDetailsSection } from './sections/EventDetailsSection';
import { HeroSection } from './sections/HeroSection';
import { InvitationSection } from './sections/InvitationSection';
import { OpeningSection } from './sections/OpeningSection';

export function App() {
  const { t } = useLanguage();
  const { startWithInvitation } = useMusic();
  const [phase, setPhase] = useState<ExperiencePhase>('closed');
  const mainRef = useRef<HTMLElement>(null);

  useScrollLock(phase !== 'open');

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  const handleOpen = useCallback(() => {
    // Runs inside the tap handler, so mobile browsers allow the music to start.
    startWithInvitation();
    setPhase('opening');
  }, [startWithInvitation]);

  const handleOpened = useCallback(() => setPhase('open'), []);

  // Once revealed, move focus to the invitation (for keyboard and screen-reader
  // users) and honour a section link such as …/#details.
  useEffect(() => {
    if (phase !== 'open') return;
    mainRef.current?.focus({ preventScroll: true });
    const target = window.location.hash.slice(1);
    if (target) document.getElementById(target)?.scrollIntoView({ block: 'start' });
  }, [phase]);

  return (
    <ExperienceContext.Provider value={phase}>
      {phase === 'open' && (
        <a
          href="#countdown"
          className="sr-only-focusable fixed start-3 top-3 z-[60] rounded-full bg-navy px-4 py-2 text-ivory"
        >
          {t.a11y.skipToContent}
        </a>
      )}

      <Header visible={phase !== 'closed'} interactive={phase === 'open'} />

      {/* Hidden (not just covered) until the card starts opening: nothing behind
          the card is painted or reachable, so the card is the first thing shown. */}
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        inert={phase !== 'open'}
        className="outline-none"
        style={{ visibility: phase === 'closed' ? 'hidden' : 'visible' }}
      >
        <HeroSection />
        <CountdownSection />
        <InvitationSection />
        <CalendarSection />
        <EventDetailsSection />
        <AnnouncementSection />
        <ClosingSection />
      </main>

      <MusicToggle visible={phase !== 'closed'} />

      {phase !== 'open' && <OpeningSection phase={phase} onOpen={handleOpen} onDone={handleOpened} />}
    </ExperienceContext.Provider>
  );
}

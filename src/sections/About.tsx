import { useEffect, useState } from 'react';
import Section from '../components/Section';
import InView from '../components/motion/InView';
import CenterpieceSlot from '../components/centerpiece/CenterpieceSlot';
import CuteComputer from '../components/spline/CuteComputer';

/**
 * ABOUT — desk scene on pointer/desktop; waveform on mobile.
 *
 * The Spline desk follows the cursor across the page — that reads as dead on
 * touch devices with no hover. Phones get the procedural voice waveform instead
 * (same story: the 800 ms signal), and never pay for the Spline download.
 */
function AboutVisual() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Avoid mounting Spline during SSR / first paint before we know the viewport.
  if (isMobile === null) {
    return <div className="min-h-[340px] rounded-xl border border-bone/14 bg-void-lift/40" />;
  }

  if (isMobile) {
    return (
      <CenterpieceSlot
        mode="waveform"
        height={340}
        caption="Voice-loop signal · the 800 ms budget, plotted"
      />
    );
  }

  return <CuteComputer height={480} />;
}

export default function About() {
  return (
    <Section id="about" index="03" label="About · how he works">
      <div className="grid gap-12 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <InView>
            <h3 className="u-display mb-8 max-w-[24ch] text-[1.75rem] text-bone sm:text-[2.5rem]">
              A voice agent has 800 milliseconds. Everything else follows from that.
            </h3>
          </InView>

          <InView>
            <div className="space-y-5 text-bone-dim">
              <p>
                Past roughly 800 milliseconds of silence, a caller assumes the line
                dropped. That single number decides the architecture above it: how
                you chunk, when you stream, what you cache, and which model you can
                afford to call at all. I design backwards from it rather than
                discovering it in production.
              </p>
              <p>
                The same discipline applies to retrieval. A system that returns a
                confident paragraph with no citation is a liability, not a feature —
                so everything I ship either returns its source or states plainly
                that it does not know. The retrieval station further down this page
                is the live proof: ask it something outside its corpus and watch it
                refuse.
              </p>
              <p>
                Boston-based, graduated December 2025, and available now. Most
                useful to Series A–C teams putting voice agents or retrieval
                systems in front of real users, where the gap between a demo and a
                dependable service is the entire job.
              </p>
            </div>
          </InView>
        </div>

        <InView>
          <AboutVisual />
        </InView>
      </div>
    </Section>
  );
}

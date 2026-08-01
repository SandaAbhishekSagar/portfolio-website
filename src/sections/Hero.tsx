import TextEffect from '../components/motion/TextEffect';
import InView from '../components/motion/InView';
import Magnetic from '../components/motion/Magnetic';
import AnimatedNumber from '../components/motion/AnimatedNumber';
import TextLoop from '../components/motion/TextLoop';
import TextShimmer from '../components/motion/TextShimmer';
import SplineHero from '../components/spline/SplineHero';

const OPEN_TO = [
  'Applied AI Engineer',
  'Voice / Speech Engineer',
  'AI Product Engineer',
  'Full-Stack AI Engineer',
];

const FACTS: { label: string; value: number; suffix?: string }[] = [
  { label: 'Docs indexed', value: 76000, suffix: '+' },
  { label: 'Voice loop budget', value: 800, suffix: ' ms' },
  { label: 'Retrieval accuracy', value: 95, suffix: '%' },
  { label: 'Hackathon build', value: 48, suffix: ' h' },
];

/**
 * The hero is text first: the name and the claim paint from HTML and CSS with
 * no dependency on WebGL. The 3D object sits in its own column to the side.
 */
export default function Hero() {
  return (
    <section id="top" className="relative">
      <div className="mx-auto w-full max-w-[74rem] px-6 pt-32 pb-20 sm:px-10 sm:pt-40">
        <div className="grid gap-10 md:grid-cols-[1.25fr_0.75fr] md:items-center">
          <div>
            <InView>
              <p className="u-mono mb-9">
                <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-ember align-middle" />
                <TextShimmer>Boston, MA · open to full-time · available now</TextShimmer>
              </p>
            </InView>

            <h1 className="u-display text-[2.5rem] text-bone sm:text-[4rem] lg:text-[6.5rem]">
              <TextEffect>Abhishek Sagar Sanda</TextEffect>
            </h1>

            <InView>
              <p className="u-mono mt-7 flex flex-wrap items-baseline gap-x-3 text-bone-dim/70">
                <span>Open to</span>
                <TextLoop items={OPEN_TO} className="text-ember" />
              </p>
            </InView>

            <InView>
              <p className="mt-9 max-w-[48ch] text-[1.0625rem] text-bone-dim">
                Applied AI engineer. I build voice agents that answer real phone
                calls, retrieval systems that cite their sources, and the
                full-stack product around both. Recent work runs on Twilio,
                FastAPI, ChromaDB and Next.js — in production, not in a notebook.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <a
                    href="#contact"
                    className="u-mono inline-block rounded-full bg-amber px-6 py-3 text-void"
                  >
                    Book a call →
                  </a>
                </Magnetic>
                <a
                  href="#index"
                  className="u-mono rounded-full border border-bone/25 px-6 py-3 text-bone transition-colors hover:border-ember hover:text-ember"
                >
                  Ask about his experience
                </a>
              </div>
            </InView>
          </div>

          <SplineHero />
        </div>

        <InView>
          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-bone/10 pt-9 sm:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="u-mono text-bone-dim/70">{f.label}</dt>
                <dd className="u-display mt-2 text-[1.75rem] text-amber">
                  <AnimatedNumber value={f.value} suffix={f.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </InView>
      </div>
    </section>
  );
}

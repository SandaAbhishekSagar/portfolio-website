import { PROFILE } from '../data/record';

/**
 * Public landing page for the keyword "ml platform engineer".
 * Prerendered at /ml-platform-engineer for crawlers and visitors.
 */
export default function MlPlatformEngineer() {
  return (
    <main className="relative z-10">
      <article className="mx-auto max-w-[74rem] px-6 pt-28 pb-24 sm:px-10 sm:pt-36">
        <a href="/" className="u-mono text-bone-dim hover:text-ember">
          ← Home
        </a>

        <p className="u-mono mt-10 text-ember">Boston, MA · open to full-time</p>
        <h1 className="u-display mt-4 max-w-[24ch] text-[2.25rem] text-bone sm:text-[3.5rem]">
          ML Platform Engineer in Boston
        </h1>
        <p className="mt-6 max-w-[58ch] text-[1.0625rem] text-bone-dim">
          {PROFILE.name} is an ML platform engineer who builds the rails under
          production AI - retrieval corpora, voice agent runtimes, evaluation
          loops, and failover - so models become dependable services.
        </p>

        <div className="mt-10 max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.7] text-bone-dim">
          <h2 className="u-display pt-2 text-[1.5rem] text-bone sm:text-[1.75rem]">
            What an ML platform engineer owns
          </h2>
          <p>
            An ML platform engineer turns model experiments into operable
            systems: ingestion and indexing for retrieval, orchestration for
            agent loops, latency budgets, observability, and the path from
            staging to a live call or product surface.
          </p>
          <p>
            As an ML platform engineer, Abhishek focuses on platforms that keep
            voice and RAG workloads honest - ChromaDB-style corpora with
            citations, LiveKit and Twilio runtimes near 800-millisecond
            response windows, and fences that fail closed when a model or
            network path breaks.
          </p>

          <h2 className="u-display pt-6 text-[1.5rem] text-bone sm:text-[1.75rem]">
            Platform proof from shipped systems
          </h2>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <a
                href="/work/northeastern-assistant"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                Northeastern University Assistant
              </a>
              {' - '}
              RAG platform over 80,000+ pages with citations, the retrieval
              half of grounded answers.
            </li>
            <li>
              AutoAce (YC F25) - voice-agent OS for dealerships: latency cut
              8.5s → 3.9s, backfilled sessions, three-layer LiveKit fence.
            </li>
            <li>
              <a
                href="/work/bitvoice-pay"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                BitVoice Pay
              </a>
              {' - '}
              voice-first Lightning wallet on a live dial-in; agent runtime on
              Twilio end to end.
            </li>
            <li>
              <a
                href="/work/interview-coach-ivr"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                AI Interview Coach IVR
              </a>
              {' - '}
              multi-turn interview coaching on a live call path.
            </li>
          </ul>

          <h2 className="u-display pt-6 text-[1.5rem] text-bone sm:text-[1.75rem]">
            Hire an ML platform engineer
          </h2>
          <p>
            Based in Boston and available for full-time roles, Abhishek joins
            teams that need an ML platform engineer to take voice and retrieval
            workloads from pilot to operable service. Related role pages:{' '}
            <a
              href="/ai-agent-engineer"
              className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
            >
              AI agent engineer
            </a>
            ,{' '}
            <a
              href="/full-stack-ai-engineer"
              className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
            >
              full-stack AI engineer
            </a>
            ,{' '}
            <a
              href="/forward-deployed-engineer"
              className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
            >
              forward deployed engineer
            </a>
            . See{' '}
            <a
              href="/#work"
              className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
            >
              selected work
            </a>
            , the{' '}
            <a
              href="/resume"
              className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
            >
              resume
            </a>
            , or{' '}
            <a
              href="/#contact"
              className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
            >
              book a call
            </a>
            .
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <a
            href="/#contact"
            className="u-mono rounded-full bg-amber px-6 py-3 text-void"
          >
            Book a call →
          </a>
          <a
            href="/#practice"
            className="u-mono rounded-full border border-bone/25 px-6 py-3 text-bone hover:border-ember hover:text-ember"
          >
            Read the practice notes
          </a>
        </div>
      </article>
    </main>
  );
}

import { PROFILE } from '../data/record';
import DocumentTitle from '../components/DocumentTitle';

const PAGE_TITLE = 'Full-Stack AI Engineer in Boston - Abhishek Sagar Sanda';

/**
 * Public landing page for the keyword "full-stack ai engineer".
 * Prerendered at /full-stack-ai-engineer for crawlers and visitors.
 */
export default function FullStackAiEngineer() {
  return (
    <main className="relative z-10">
      <DocumentTitle title={PAGE_TITLE} />
      <article className="mx-auto max-w-[74rem] px-6 pt-28 pb-24 sm:px-10 sm:pt-36">
        <a href="/" className="u-mono text-bone-dim hover:text-ember">
          ← Home
        </a>

        <p className="u-mono mt-10 text-ember">Boston, MA · open to full-time</p>
        <h1 className="u-display mt-4 max-w-[24ch] text-[2.25rem] text-bone sm:text-[3.5rem]">
          Full-Stack AI Engineer in Boston
        </h1>
        <p className="mt-6 max-w-[58ch] text-[1.0625rem] text-bone-dim">
          {PROFILE.name} is a full-stack AI engineer who owns the model loop and
          the product surface - FastAPI backends, Next.js clients, voice
          telephony, and retrieval stacks that cite sources in production.
        </p>

        <div className="mt-10 max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.7] text-bone-dim">
          <h2 className="u-display pt-2 text-[1.5rem] text-bone sm:text-[1.75rem]">
            What a full-stack AI engineer ships
          </h2>
          <p>
            A full-stack AI engineer does not stop at a notebook. They design
            the API, the orchestration, the evaluation harness, and the UI or
            call path users actually hit - then keep latency, citations, and
            failover honest under load.
          </p>
          <p>
            As a full-stack AI engineer, Abhishek builds across Python and
            TypeScript: voice agents on Twilio and LiveKit, RAG over large
            corpora with ChromaDB-style retrieval, and product surfaces that
            expose measurable behavior rather than slide-deck demos.
          </p>

          <h2 className="u-display pt-6 text-[1.5rem] text-bone sm:text-[1.75rem]">
            Proof across the stack
          </h2>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <a
                href="/work/bitvoice-pay"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                BitVoice Pay
              </a>
              {' - '}
              voice-first Lightning wallet end to end: telephony, agent loop,
              and live dial-in proof.
            </li>
            <li>
              <a
                href="/work/northeastern-assistant"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                Northeastern University Assistant
              </a>
              {' - '}
              RAG over 80,000+ pages with citations, retrieval plus product
              surface.
            </li>
            <li>
              AutoAce (YC F25) - voice-agent OS for dealerships: latency cut
              8.5s → 3.9s, backfilled sessions, three-layer LiveKit fence.
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
            Hire a full-stack AI engineer
          </h2>
          <p>
            Based in Boston and available for full-time roles, Abhishek joins
            teams that need a full-stack AI engineer to take voice and retrieval
            products from prototype to dependable service. Related role pages:{' '}
            <a
              href="/ai-agent-engineer"
              className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
            >
              AI agent engineer
            </a>
            ,{' '}
            <a
              href="/forward-deployed-engineer"
              className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
            >
              forward deployed engineer
            </a>
            ,{' '}
            <a
              href="/ml-platform-engineer"
              className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
            >
              ML platform engineer
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

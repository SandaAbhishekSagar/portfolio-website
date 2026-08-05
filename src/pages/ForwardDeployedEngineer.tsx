import { PROFILE } from '../data/record';

/**
 * Public landing page for the keyword "forward deployed engineer".
 * Prerendered at /forward-deployed-engineer for crawlers and visitors.
 */
export default function ForwardDeployedEngineer() {
  return (
    <main className="relative z-10">
      <article className="mx-auto max-w-[74rem] px-6 pt-28 pb-24 sm:px-10 sm:pt-36">
        <a href="/" className="u-mono text-bone-dim hover:text-ember">
          ← Home
        </a>

        <p className="u-mono mt-10 text-ember">Boston, MA · open to full-time</p>
        <h1 className="u-display mt-4 max-w-[24ch] text-[2.25rem] text-bone sm:text-[3.5rem]">
          Forward Deployed Engineer in Boston
        </h1>
        <p className="mt-6 max-w-[58ch] text-[1.0625rem] text-bone-dim">
          {PROFILE.name} is a forward deployed engineer who sits with the
          problem - shipping voice agents, RAG systems, and product surfaces into
          real call paths and real users, not only into a staging slide.
        </p>

        <div className="mt-10 max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.7] text-bone-dim">
          <h2 className="u-display pt-2 text-[1.5rem] text-bone sm:text-[1.75rem]">
            What a forward deployed engineer does
          </h2>
          <p>
            A forward deployed engineer embeds beside the customer or product
            team, learns the operational constraint, and owns the path from
            prototype to production. That means instrumentation, failover,
            evaluation loops, and the last mile of integration - telephony,
            data sources, and the UI callers or operators actually use.
          </p>
          <p>
            As a forward deployed engineer, Abhishek works backward from hard
            budgets: response windows near 800 milliseconds on live calls,
            retrieval that cites sources or refuses, and systems that stay up
            when a model or network path fails. The job is outcomes in the
            field, measured after deploy.
          </p>

          <h2 className="u-display pt-6 text-[1.5rem] text-bone sm:text-[1.75rem]">
            Field proof from shipped systems
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
              voice-first Lightning wallet on a live dial-in; end-to-end agent
              behavior on Twilio, not a mock.
            </li>
            <li>
              AutoAce (YC F25) - voice-agent OS for dealerships: latency cut
              8.5s → 3.9s, backfilled sessions, three-layer LiveKit fence under
              real traffic constraints.
            </li>
            <li>
              <a
                href="/work/northeastern-assistant"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                Northeastern University Assistant
              </a>
              {' - '}
              RAG over 80,000+ pages with citations for operators who need
              grounded answers.
            </li>
            <li>
              <a
                href="/work/interview-coach-ivr"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                AI Interview Coach IVR
              </a>
              {' - '}
              multi-turn coaching on a live call path.
            </li>
          </ul>

          <h2 className="u-display pt-6 text-[1.5rem] text-bone sm:text-[1.75rem]">
            Hire a forward deployed engineer
          </h2>
          <p>
            Based in Boston and available for full-time roles, Abhishek joins
            teams that need a forward deployed engineer to take AI products from
            pilot to dependable service - voice, retrieval, and the full stack
            around them. Related role pages:{' '}
            <a
              href="/ai-agent-engineer"
              className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
            >
              AI agent engineer
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

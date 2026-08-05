import { PROFILE } from '../data/record';

/**
 * Public landing page for the keyword "ai agent engineer".
 * Prerendered at /ai-agent-engineer so crawlers and Search Console see full HTML.
 */
export default function AiAgentEngineer() {
  return (
    <main className="relative z-10">
      <article className="mx-auto max-w-[74rem] px-6 pt-28 pb-24 sm:px-10 sm:pt-36">
        <a href="/" className="u-mono text-bone-dim hover:text-ember">
          ← Home
        </a>

        <p className="u-mono mt-10 text-ember">Boston, MA · open to full-time</p>
        <h1 className="u-display mt-4 max-w-[22ch] text-[2.25rem] text-bone sm:text-[3.5rem]">
          AI Agent Engineer in Boston
        </h1>
        <p className="mt-6 max-w-[58ch] text-[1.0625rem] text-bone-dim">
          {PROFILE.name} is an AI agent engineer building voice agents, retrieval
          systems, and the full-stack product that keeps them reliable in
          production - not only in a notebook.
        </p>

        <div className="mt-10 max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.7] text-bone-dim">
          <h2 className="u-display pt-2 text-[1.5rem] text-bone sm:text-[1.75rem]">
            What an AI agent engineer ships
          </h2>
          <p>
            An AI agent engineer designs systems that act under real constraints:
            live phone calls, latency budgets near 800 milliseconds, tool use,
            and failover when a model or network path fails. That means owning
            telephony (Twilio, LiveKit), orchestration, evaluation, and the
            product surface callers or users actually touch.
          </p>
          <p>
            As an AI agent engineer, Abhishek focuses on two production patterns:
            conversational voice agents that answer inbound calls end to end, and
            retrieval-augmented agents that cite sources or refuse when the corpus
            does not support an answer. Both demand measurable loops - not demos
            that only work on a laptop.
          </p>

          <h2 className="u-display pt-6 text-[1.5rem] text-bone sm:text-[1.75rem]">
            Proof from shipped systems
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
              voice-first Lightning wallet over a phone call; live dial-in proof
              of agent behavior on Twilio.
            </li>
            <li>
              <a
                href="/work/northeastern-assistant"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                Northeastern University Assistant
              </a>
              {' - '}
              RAG over 80,000+ pages with citations, the retrieval half of agent
              grounding.
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
            <li>
              AutoAce (YC F25) - voice-agent OS for dealerships: latency cut
              8.5s → 3.9s, backfilled sessions, three-layer LiveKit fence.
            </li>
          </ul>

          <h2 className="u-display pt-6 text-[1.5rem] text-bone sm:text-[1.75rem]">
            Hire an AI agent engineer
          </h2>
          <p>
            Based in Boston and available for full-time roles, Abhishek works with
            Series A–C teams that need an AI agent engineer to take voice and
            retrieval products from prototype to dependable service. Related:{' '}
            <a
              href="/forward-deployed-engineer"
              className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
            >
              forward deployed engineer
            </a>
            ,{' '}
            <a
              href="/full-stack-ai-engineer"
              className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
            >
              full-stack AI engineer
            </a>
            . Start with the{' '}
            <a
              href="/#work"
              className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
            >
              selected work
            </a>
            , read the{' '}
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

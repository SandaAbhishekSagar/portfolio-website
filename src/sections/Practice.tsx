import Section from '../components/Section';
import InView from '../components/motion/InView';

/**
 * Early-page body copy for search engines and humans: keywords appear in
 * natural sentences, with structure and enough length for crawlers without
 * stuffing the hero.
 */
export default function Practice() {
  return (
    <Section id="practice" index="01" label="Practice · voice AI, RAG, conversational systems">
      <div className="pb-24">
        <InView>
          <h3 className="u-display mb-6 max-w-[28ch] text-[1.75rem] text-bone sm:text-[2.5rem]">
            Expert AI engineer in Boston, MA
          </h3>
          <p className="u-mono mb-10 max-w-[52ch] text-ember">
            Advanced solutions in voice agents and retrieval systems
          </p>
        </InView>

        <InView>
          <div className="max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.7] text-bone-dim">
            <p>
              Abhishek Sagar Sanda is an applied research engineer based in Boston,
              specializing in high-performance artificial intelligence systems. His
              work focuses on dependable, production-ready AI services - especially
              for early-stage teams where the gap between a prototype and a
              reliable user-facing product is the entire job. He designs from
              system constraints and caller experience outward, so each build is
              both measurable and practical.
            </p>

            <h4 className="u-display pt-4 text-[1.25rem] text-bone sm:text-[1.5rem]">
              Core competencies: conversational AI and retrieval-augmented generation
            </h4>
            <p>
              His practice centers on two areas: responsive Voice AI systems and
              trustworthy retrieval. By designing backward from hard budgets -
              such as the 800-millisecond response window in voice interactions -
              he builds architectures that prioritize speed, accuracy, and
              retention. As a conversational AI engineer, he ships agents that
              feel natural on a live phone call rather than only in a demo reel.
            </p>

            <h4 className="u-display pt-4 text-[1.25rem] text-bone sm:text-[1.5rem]">
              How a RAG engineer approaches accountability
            </h4>
            <p>
              A core rule of his work is accountability in retrieval. A system
              that answers without a verifiable source is a liability. Every
              retrieval stack he ships either cites its material or states that
              it does not know. That discipline is what makes a reliable RAG
              engineer: systems teams and callers can trust. The same standard
              applies when spoken answers sit on top of a knowledge base - the
              reply is only as good as the citation behind it.
            </p>

            <h4 className="u-display pt-4 text-[1.25rem] text-bone sm:text-[1.5rem]">
              Selected work and case studies
            </h4>
            <p>
              The portfolio below is a set of full case studies across telephony,
              retrieval, and applied modeling:
            </p>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                <a
                  href="/work/bitvoice-pay"
                  className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
                >
                  BitVoice Pay
                </a>
                {' - '}
                a voice-first Bitcoin Lightning wallet operated entirely by phone
                call (2nd place, MIT Bitcoin Hackathon), owned end to end on the
                Twilio voice path.
              </li>
              <li>
                <a
                  href="/work/northeastern-assistant"
                  className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
                >
                  Northeastern University Assistant v2.0
                </a>
                {' - '}
                a faculty-sponsored RAG system over 80,000+ pages, where retrieval
                work means citing sources at student scale.
              </li>
              <li>
                <a
                  href="/work/interview-coach-ivr"
                  className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
                >
                  AI Interview Coach IVR
                </a>
                {' - '}
                telephony interview coaching over a real inbound call path.
              </li>
              <li>
                <a
                  href="/work/ai-dynamic-chatbot"
                  className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
                >
                  AI Dynamic Chatbot
                </a>
                {' - '}
                Roli.AI Hackathon winner for a conversational assistant with
                durable session state.
              </li>
              <li>
                <a
                  href="/work/wyckoff-trading-assistant"
                  className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
                >
                  Wyckoff Trading Assistant
                </a>
                {' - '}
                Transformer labeling of market structure.
              </li>
              <li>
                <a
                  href="/work/manipuri-translator"
                  className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
                >
                  Manipuri ↔ English Translator
                </a>
                {' - '}
                low-resource neural machine translation trained from scratch.
              </li>
            </ul>

            <h4 className="u-display pt-4 text-[1.25rem] text-bone sm:text-[1.5rem]">
              Engage an AI engineer in Boston
            </h4>
            <p>
              Available now for full-time roles, Abhishek Sagar Sanda works with
              teams shipping voice agents and retrieval products. If you need a
              conversational AI engineer who also operates as a hands-on RAG
              engineer - someone who will own latency budgets, citations, and
              production failover - start with the work index below or{' '}
              <a
                href="#contact"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                book a call
              </a>
              .
            </p>
          </div>
        </InView>
      </div>
    </Section>
  );
}

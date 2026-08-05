import Section from '../components/Section';
import InView from '../components/motion/InView';

/**
 * Keyword-bearing H2/H3 structure for search (IONOS + crawlers) while keeping
 * the site's measured prose voice.
 */
export default function Practice() {
  return (
    <Section id="practice" index="01" label="Practice · voice AI, RAG, conversational systems">
      <div className="pb-24">
        <InView>
          <h2 className="u-display mb-8 max-w-[28ch] text-[1.75rem] text-bone sm:text-[2.5rem]">
            Showcase: Advanced Voice AI and Conversational AI Engineer Projects
          </h2>
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

            <h3 className="u-display pt-6 text-[1.25rem] text-bone sm:text-[1.5rem]">
              BitVoice Pay: A Voice-First Bitcoin Lightning Wallet Solution
            </h3>
            <p>
              <a
                href="/work/bitvoice-pay"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                BitVoice Pay
              </a>{' '}
              is a Voice AI product: a Bitcoin Lightning wallet operated entirely
              by phone call (2nd place, MIT Bitcoin Hackathon). Callers
              authenticate with a PIN, speak intents, and settle on real LNbits
              wallets - end to end on Twilio.
            </p>

            <h3 className="u-display pt-6 text-[1.25rem] text-bone sm:text-[1.5rem]">
              Faculty-Sponsored RAG System for Northeastern University
            </h3>
            <p>
              <a
                href="/work/northeastern-assistant"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                Northeastern University Assistant v2.0
              </a>{' '}
              is a faculty-sponsored retrieval system over 80,000+ pages. Answers
              cite their sources - the accountability bar for any serious RAG
              engineer deployment at campus scale.
            </p>

            <h3 className="u-display pt-6 text-[1.25rem] text-bone sm:text-[1.5rem]">
              Telephony-Based AI Interview Coaching IVR System
            </h3>
            <p>
              <a
                href="/work/interview-coach-ivr"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                AI Interview Coach IVR
              </a>{' '}
              runs mock interviews over a live call path, scoring speech rate,
              filler words, confidence, and clarity - applied telephony for
              conversational practice.
            </p>

            <p className="pt-2">
              Further case studies include the{' '}
              <a
                href="/work/ai-dynamic-chatbot"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                AI Dynamic Chatbot
              </a>{' '}
              (Roli.AI Hackathon winner), the{' '}
              <a
                href="/work/wyckoff-trading-assistant"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                Wyckoff Trading Assistant
              </a>
              , and a{' '}
              <a
                href="/work/manipuri-translator"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                Manipuri ↔ English Translator
              </a>{' '}
              trained from scratch for a low-resource pair.
            </p>

            <h2 className="u-display pt-10 text-[1.75rem] text-bone sm:text-[2.5rem]">
              Engage a Professional RAG Engineer for Your Retrieval Systems
            </h2>

            <h3 className="u-display pt-6 text-[1.25rem] text-bone sm:text-[1.5rem]">
              System Design Philosophy: Speed, Accuracy, and Reliability
            </h3>
            <p>
              Practice centers on responsive Voice AI and trustworthy retrieval.
              By designing backward from hard budgets - such as the
              800-millisecond response window in voice interactions - he builds
              architectures that prioritize speed, accuracy, and retention. A
              system that answers without a verifiable source is a liability;
              every retrieval stack either cites its material or states that it
              does not know.
            </p>

            <h3 className="u-display pt-6 text-[1.25rem] text-bone sm:text-[1.5rem]">
              Developing Dependable Conversational AI Engineer Services
            </h3>
            <p>
              As a conversational AI engineer, he ships agents that feel natural
              on a live phone call rather than only in a demo reel - owning
              latency budgets, citations, and production failover for teams that
              need dependable services, not slides. For a focused role page, see{' '}
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
                href="/full-stack-ai-engineer"
                className="text-amber underline decoration-amber/35 underline-offset-4 hover:text-ember"
              >
                full-stack AI engineer
              </a>
              , or{' '}
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

import { useEffect, useState } from 'react';
import Section from '../components/Section';
import InView from '../components/motion/InView';
import BorderTrail from '../components/motion/BorderTrail';
import { INDEX_DEFAULTS } from '../data/record';
import { ask, getAskMeta, type AskMeta, type AskResult } from '../lib/api';

/**
 * THE INDEX — the signature station.
 *
 * A working retrieval agent over a fixed corpus of resume lines and project
 * READMEs. BM25 server-side, extractive answers composed only from retrieved
 * text, retrieved source and measured p50 latency in mono. Refuses
 * out-of-corpus questions instead of inventing. Full section, never a corner
 * bubble. The BorderTrail is the only continuously animated thing on the page
 * — here it means "this is running".
 */
export default function AskIndex() {
  const [meta, setMeta] = useState<AskMeta>(() => ({
    corpus: INDEX_DEFAULTS.corpus,
    p50_ms: INDEX_DEFAULTS.p50_ms,
    queries: INDEX_DEFAULTS.queries,
    suggestions: [...INDEX_DEFAULTS.suggestions],
    sources: [...INDEX_DEFAULTS.sources],
  }));
  const [q, setQ] = useState('');
  const [result, setResult] = useState<AskResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAskMeta()
      .then(setMeta)
      .catch(() => setError('Index unavailable. Reload to retry.'));
  }, []);

  const run = async (question: string) => {
    const text = question.trim();
    if (text.length < 3) {
      setError('Ask a question of at least three characters.');
      return;
    }
    setError(null);
    setBusy(true);
    try {
      setResult(await ask(text));
    } catch {
      setError('Retrieval failed. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section id="index" index="06" label="The index · grounded retrieval">
      <div className="pb-24">
        <InView>
          <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <h3 className="u-display max-w-[18ch] text-[1.75rem] text-bone sm:text-[2.5rem]">
              Ask about his experience. It cites the file.
            </h3>
            <p className="text-[0.9375rem] text-bone-dim">
              Real retrieval, not a chat widget. BM25 over a fixed corpus of resume
              lines and project READMEs; the answer is composed only from retrieved
              text. Out-of-corpus questions get refused, not invented.
            </p>
          </div>
        </InView>

        <div className="relative overflow-hidden rounded-xl border border-ember/25 bg-void-lift/90">
          <BorderTrail size={70} className="bg-ember/70" duration={7} />

          <div className="relative flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-bone/10 px-5 py-3">
            <span className="u-mono text-ember">
              <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-ember align-middle" />
              index live
            </span>
            <span className="u-mono text-bone-dim/75">chunks {meta.corpus}</span>
            <span className="u-mono text-bone-dim/75">
              p50 {(result?.p50_ms ?? meta.p50_ms) || '—'} ms
            </span>
            <span className="u-mono text-bone-dim/75">queries {meta.queries}</span>
          </div>

          <form
            className="relative flex flex-col gap-3 p-5 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              run(q);
            }}
          >
            <label htmlFor="ask-input" className="sr-only">
              Ask a question about Abhishek&apos;s experience
            </label>
            <input
              id="ask-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="What has he shipped with voice agents?"
              className="flex-1 rounded-md border border-bone/15 bg-void px-4 py-3 font-mono text-[0.8125rem] tracking-[0.04em] text-bone placeholder:text-bone-dim/50 focus:border-ember focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy}
              className="u-mono rounded-md bg-amber px-6 py-3 text-void disabled:opacity-55"
            >
              {busy ? 'retrieving…' : 'retrieve'}
            </button>
          </form>

          <div className="relative flex flex-wrap gap-2 px-5 pb-5">
            {meta.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setQ(s);
                  run(s);
                }}
                className="u-mono rounded-full border border-bone/15 px-3 py-1.5 text-bone-dim hover:border-ember hover:text-ember"
              >
                {s}
              </button>
            ))}
          </div>

          {error && (
            <p role="alert" className="u-mono relative border-t border-ember/30 bg-ember/10 px-5 py-4 text-ember">
              {error}
            </p>
          )}

          <div aria-live="polite" className="relative border-t border-bone/10">
            {busy && <p className="u-mono px-5 py-6 text-bone-dim">scoring corpus…</p>}

            {!busy && result && (
              <div className="grid gap-8 p-5 lg:grid-cols-[1.25fr_0.75fr]">
                <div>
                  <p className="u-mono mb-3 text-bone-dim/70">answer</p>
                  <p className="text-[1.0625rem] leading-[1.65] text-bone">{result.answer}</p>
                  <p className="u-mono mt-5 text-bone-dim/65">
                    latency {result.latency_ms} ms · p50 {result.p50_ms} ms · k={result.k} of{' '}
                    {result.corpus} · {result.grounded ? 'grounded' : 'refused - out of corpus'}
                  </p>
                </div>
                <div>
                  <p className="u-mono mb-3 text-bone-dim/70">retrieved source</p>
                  <ul className="space-y-3">
                    {result.sources.length === 0 && (
                      <li className="u-mono text-bone-dim/60">no chunk above threshold</li>
                    )}
                    {result.sources.map((s) => (
                      <li key={s.source} className="rounded-md border border-bone/12 bg-void p-3">
                        <p className="u-mono text-latent">{s.source}</p>
                        <p className="mt-1 text-[0.9375rem] text-bone-dim">{s.title}</p>
                        <p className="u-mono mt-1 text-bone-dim/60">score {s.score}</p>
                        {s.url && (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="u-mono mt-2 inline-block text-amber underline underline-offset-4"
                          >
                            open ↗
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!busy && !result && !error && (
              <p className="u-mono px-5 py-6 text-bone-dim/60">
                corpus: {meta.sources.slice(0, 6).join(' · ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

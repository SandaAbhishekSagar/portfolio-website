import { useMemo, useState } from 'react';
import Section from '../components/Section';
import InView from '../components/motion/InView';
import Tilt from '../components/motion/Tilt';
import Spotlight from '../components/motion/Spotlight';
import { CLUSTERS, PROJECTS, type Project } from '../data/record';

/** The heading counts the record, so the copy can never outrun the case studies. */
const COUNT_WORDS: Record<number, string> = {
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
};

/**
 * WORK — the index.
 *
 * Renders directly from the canonical record rather than fetching, so every
 * project title, metric, and link is present in the prerendered HTML. The
 * cluster surface shows title plus one metric; the depth lives in the case
 * study at /work/{slug}.
 */
export default function Work() {
  const [activeSlug, setActiveSlug] = useState<string>(PROJECTS[0].slug);
  const [filter, setFilter] = useState<string>('all');

  const shown = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.cluster === filter)),
    [filter]
  );

  const active: Project =
    shown.find((p) => p.slug === activeSlug) ?? shown[0] ?? PROJECTS[0];

  return (
    <Section id="work" index="02" label="Selected work">
      <div className="pb-24">
        <InView>
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h3 className="u-display max-w-[20ch] text-[1.75rem] text-bone sm:text-[2.5rem]">
              {COUNT_WORDS[PROJECTS.length] ?? PROJECTS.length} systems. Every one
              opens to a full case study.
            </h3>
            <ul className="flex flex-wrap gap-2" aria-label="Filter by domain">
              {[{ key: 'all', label: 'All' }, ...CLUSTERS.map((c) => ({ key: c.key, label: c.label }))].map(
                (c) => {
                  const on = filter === c.key;
                  return (
                    <li key={c.key}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setFilter(c.key)}
                        className={`u-mono rounded-full border px-4 py-2 transition-colors ${
                          on
                            ? 'border-ember bg-ember/12 text-ember'
                            : 'border-bone/18 text-bone-dim hover:border-bone/40 hover:text-bone'
                        }`}
                      >
                        {c.label}
                      </button>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        </InView>

        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <ul className="border-t border-bone/10">
            {shown.map((p, i) => {
              const on = active.slug === p.slug;
              return (
                <li key={p.slug} className="border-b border-bone/10">
                  <div
                    onMouseEnter={() => setActiveSlug(p.slug)}
                    className="work-row flex items-baseline gap-4 py-5"
                  >
                    <span className={`u-mono shrink-0 ${on ? 'text-ember' : 'text-bone-dim/55'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <a
                        href={`/work/${p.slug}`}
                        onFocus={() => setActiveSlug(p.slug)}
                        className={`u-display block text-[1.3125rem] transition-colors hover:text-ember ${
                          on ? 'text-bone' : 'text-bone/80'
                        }`}
                      >
                        {p.title}
                      </a>
                      <span className="u-mono mt-1 block text-bone-dim/70">{p.kind}</span>
                    </span>
                    <span className="u-mono hidden shrink-0 text-amber sm:block">
                      {p.metric.value}
                    </span>
                    <span className="u-mono shrink-0 text-bone-dim/60">{p.year}</span>
                    <span className="work-arrow u-mono shrink-0 text-ember" aria-hidden="true">
                      →
                    </span>
                  </div>
                </li>
              );
            })}
            {!shown.length && (
              <li className="u-mono py-6 text-bone-dim/60">No projects in this domain.</li>
            )}
          </ul>

          <div className="lg:sticky lg:top-24">
            <Tilt className="rounded-xl">
              <article className="relative overflow-hidden rounded-xl border border-bone/14 bg-void-lift/90 p-7">
                <Spotlight size={300} className="bg-ember/18" />
                <div className="relative">
                  <p className="u-mono text-ember">{active.kind}</p>
                  <h4 className="u-display mt-3 text-[1.75rem] text-bone">{active.title}</h4>
                  <p className="mt-4 text-[0.9375rem] leading-[1.7] text-bone-dim">
                    {active.summary}
                  </p>

                  <dl className="mt-6 border-t border-bone/10 pt-5">
                    <dt className="u-mono text-bone-dim/70">{active.metric.label}</dt>
                    <dd className="u-display mt-2 text-[1.75rem] text-amber">
                      {active.metric.value}
                    </dd>
                  </dl>

                  <p className="u-mono mt-5 text-bone-dim/75">{active.stack.join(' · ')}</p>

                  <div className="mt-7 flex flex-wrap gap-4">
                    <a
                      href={`/work/${active.slug}`}
                      className="u-mono text-amber underline decoration-amber/35 underline-offset-4"
                    >
                      Read the case study →
                    </a>
                    {active.repo && (
                      <a
                        href={active.repo}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="u-mono text-bone underline decoration-bone/25 underline-offset-4 hover:text-ember"
                      >
                        Source ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Tilt>
          </div>
        </div>
      </div>
    </Section>
  );
}

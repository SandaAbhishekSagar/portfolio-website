import { PROJECTS, getProject, PROFILE } from '../data/record';

function Prose({ children }: { children: string }) {
  return (
    <p className="max-w-[62ch] text-[0.9375rem] leading-[1.7] text-bone-dim">
      {children}
    </p>
  );
}

/**
 * Deep-linkable case study at /work/{slug}. Prerendered, so it is a complete
 * document with JavaScript disabled and previews correctly when shared.
 * Prose sections are capped short — structure carries the load.
 */
export default function CaseStudy({ slug }: { slug: string }) {
  const p = getProject(slug);

  if (!p) {
    return (
      <main className="relative z-10 mx-auto max-w-[74rem] px-6 py-32 sm:px-10">
        <h1 className="u-display text-[2.5rem] text-bone">Project not found</h1>
        <p className="mt-4 text-bone-dim">That case study does not exist.</p>
        <a href="/#work" className="u-mono mt-8 inline-block text-amber underline underline-offset-4">
          ← All work
        </a>
      </main>
    );
  }

  const others = PROJECTS.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <main className="relative z-10">
      <article className="mx-auto max-w-[74rem] px-6 pt-28 pb-24 sm:px-10 sm:pt-36">
        <a href="/#work" className="u-mono text-bone-dim hover:text-ember">
          ← All work
        </a>

        <p className="u-mono mt-10 text-ember">{p.kind}</p>
        <h1 className="u-display mt-4 text-[2.5rem] text-bone sm:text-[4rem]">{p.title}</h1>
        <p className="mt-5 max-w-[58ch] text-[1.0625rem] text-bone-dim">{p.summary}</p>

        <dl className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-y border-bone/10 py-5">
          <dt className="u-mono text-bone-dim/70">{p.metric.label}</dt>
          <dd className="u-display text-[1.75rem] text-amber">
            {p.metric.value}
          </dd>
          <dd className="u-mono ml-auto text-bone-dim/70">{p.year}</dd>
        </dl>

        {/* diagram — procedural, no image asset to 404 */}
        <figure className="mt-10 overflow-hidden rounded-xl border border-bone/12 bg-void-lift/60 p-8">
          <svg viewBox="0 0 900 180" className="w-full" role="img" aria-label={`Architecture of ${p.title}`}>
            <defs>
              <linearGradient id="flow" x1="0" x2="1">
                <stop offset="0%" stopColor="#ff8a5b" />
                <stop offset="100%" stopColor="#f0a93c" />
              </linearGradient>
            </defs>
            <line x1="40" y1="90" x2="860" y2="90" stroke="url(#flow)" strokeWidth="1.5" opacity="0.5" />
            {p.architecture.slice(0, 4).map((step, i, arr) => {
              const x = 40 + (820 / Math.max(1, arr.length - 1 || 1)) * i;
              return (
                <g key={i}>
                  <circle cx={x} cy="90" r="7" fill="#f0a93c" />
                  <text
                    x={x}
                    y="126"
                    textAnchor="middle"
                    fill="#b49b8d"
                    fontSize="12"
                    fontFamily="monospace"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </text>
                </g>
              );
            })}
          </svg>
          <figcaption className="u-mono mt-4 text-bone-dim/60">
            Signal path · {p.architecture.length} stages
          </figcaption>
        </figure>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div className="space-y-10">
            <section>
              <h2 className="u-mono mb-3 text-latent">The problem</h2>
              <Prose>{p.problem}</Prose>
            </section>

            <section>
              <h2 className="u-mono mb-3 text-latent">What made it hard</h2>
              <Prose>{p.constraint}</Prose>
            </section>

            <section>
              <h2 className="u-mono mb-3 text-latent">Architecture</h2>
              <ol className="space-y-3">
                {p.architecture.map((a, i) => (
                  <li key={a} className="flex gap-4">
                    <span className="u-mono shrink-0 text-ember">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[0.9375rem] leading-[1.7] text-bone-dim">
                      {a}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="u-mono mb-3 text-latent">Outcomes</h2>
              <ul className="space-y-3">
                {p.outcomes.map((o) => (
                  <li key={o} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-amber" />
                    <span className="text-[0.9375rem] leading-[1.7] text-bone-dim">
                      {o}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="rounded-xl border border-bone/12 bg-void-lift/70 p-6 lg:sticky lg:top-24">
            <h2 className="u-mono mb-4 text-latent">Stack</h2>
            <ul className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li
                  key={s}
                  className="rounded border border-bone/14 px-2.5 py-1 font-mono text-[0.8125rem] tracking-[0.04em] text-bone"
                >
                  {s}
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-3 border-t border-bone/10 pt-5">
              {p.repo && (
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="u-mono block text-bone underline decoration-bone/25 underline-offset-4 hover:text-ember"
                >
                  Source ↗
                </a>
              )}
              {p.demo && (
                <a
                  href={p.demo}
                  {...(p.demo.startsWith('tel:')
                    ? {}
                    : { target: '_blank', rel: 'noreferrer noopener' })}
                  className="u-mono block text-amber underline decoration-amber/35 underline-offset-4"
                >
                  {p.demoLabel || 'Demo'}
                  {p.demo.startsWith('tel:') ? '' : ' ↗'}
                </a>
              )}
              <a href="/#contact" className="u-mono block text-amber underline underline-offset-4">
                Discuss this work →
              </a>
            </div>
          </aside>
        </div>

        <nav aria-label="More work" className="mt-20 border-t border-bone/10 pt-10">
          <p className="u-mono mb-5 text-latent">More work</p>
          <ul className="grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <a
                  href={`/work/${o.slug}`}
                  className="block rounded-lg border border-bone/12 bg-void-lift/50 p-5 hover:border-ember/40"
                >
                  <span className="u-mono text-bone-dim/70">{o.kind}</span>
                  <span className="u-display mt-2 block text-[1.3125rem] text-bone">{o.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="mt-16 border-t border-bone/10 pt-8">
          <p className="u-mono text-bone-dim/60">
            {PROFILE.name} · {PROFILE.location} · {PROFILE.availability}
          </p>
        </footer>
      </article>
    </main>
  );
}

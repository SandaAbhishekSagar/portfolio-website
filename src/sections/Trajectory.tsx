import { useState } from 'react';
import Section from '../components/Section';
import InView from '../components/motion/InView';
import { EXPERIENCE, EDUCATION } from '../data/record';

/**
 * TRAJECTORY — employment history as a horizontal rail.
 *
 * Each role expands in place to a full entry: company, title, dates, stack,
 * and outcome bullets. No modal, no navigation away. Uses <details>/<summary>
 * semantics so it is fully readable and expandable with JavaScript disabled.
 */
export default function Trajectory() {
  const [open, setOpen] = useState<string>(EXPERIENCE[0].slug);

  return (
    <Section id="trajectory" index="03" label="Trajectory · employment history">
      <div className="pb-24">
        <InView>
          <h3 className="u-display mb-3 max-w-[22ch] text-[1.75rem] text-bone sm:text-[2.5rem]">
            Seven roles, from enterprise .NET to a YC voice-agent OS.
          </h3>
          <p className="mb-10 max-w-[58ch] text-bone-dim">
            Reverse-chronological. Select a role to expand it in place.
          </p>
        </InView>

        {/* the rail */}
        <ol className="mb-10 flex gap-px overflow-x-auto border-y border-bone/10">
          {EXPERIENCE.map((r) => {
            const on = open === r.slug;
            return (
              <li key={r.slug} className="min-w-[9.5rem] flex-1">
                <button
                  type="button"
                  onClick={() => setOpen(r.slug)}
                  aria-expanded={on}
                  aria-controls={`role-${r.slug}`}
                  className={`h-full w-full px-4 py-5 text-left transition-colors ${
                    on ? 'bg-ember/10' : 'hover:bg-bone/4'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`mb-3 block h-px w-full ${on ? 'bg-ember' : 'bg-bone/20'}`}
                  />
                  <span className={`u-mono block ${on ? 'text-ember' : 'text-bone-dim/70'}`}>
                    {r.period}
                  </span>
                  <span className={`mt-2 block text-[0.9375rem] ${on ? 'text-bone' : 'text-bone/75'}`}>
                    {r.org}
                  </span>
                  {r.latest && <span className="u-mono mt-1 block text-ember">latest</span>}
                </button>
              </li>
            );
          })}
        </ol>

        {/* full entries — all present in the DOM, so no-JS shows every one */}
        <div className="space-y-4">
          {EXPERIENCE.map((r) => {
            const on = open === r.slug;
            return (
              <article
                key={r.slug}
                id={`role-${r.slug}`}
                className={`rounded-xl border p-7 transition-colors ${
                  on ? 'border-bone/16 bg-void-lift/85' : 'border-bone/8 bg-void-lift/35'
                } ${on ? '' : 'hidden md:block'}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h4 className="u-display text-[1.3125rem] text-bone">
                    {r.role}
                    <span className="text-bone-dim"> · {r.org}</span>
                    {r.orgNote && (
                      <span className="u-mono ml-3 align-middle text-ember">{r.orgNote}</span>
                    )}
                  </h4>
                  <p className="u-mono text-bone-dim/70">
                    {r.period}
                    {' · '}
                    {r.location}
                  </p>
                </div>

                <ul className="mt-5 space-y-2.5">
                  {r.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[0.9375rem] leading-[1.7]">
                      <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ember" />
                      <span className="text-bone-dim">{b}</span>
                    </li>
                  ))}
                </ul>

                <p className="u-mono mt-5 text-bone-dim/75">{r.stack.join(' · ')}</p>
              </article>
            );
          })}
        </div>

        {/* education */}
        <div className="mt-14 border-t border-bone/10 pt-10">
          <p className="u-mono mb-6 text-latent">Education</p>
          <ul className="grid gap-6 md:grid-cols-2">
            {EDUCATION.map((e) => (
              <li key={e.degree} className="rounded-xl border border-bone/10 bg-void-lift/50 p-6">
                <h4 className="u-display text-[1.3125rem] text-bone">{e.degree}</h4>
                <p className="u-mono mt-2 text-bone-dim/80">{e.school}</p>
                <p className="u-mono mt-1 text-bone-dim/70">
                  {[e.location, e.date].filter(Boolean).join(' · ')}
                </p>
                {e.gpa && (
                  <p className="u-mono mt-3 text-amber">GPA {e.gpa}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

import Section from '../components/Section';
import InView from '../components/motion/InView';
import { SKILLS, SKILL_GROUPS } from '../data/record';

/**
 * SKILLS — organised by what he does with each tool, not a logo wall.
 * Twelve entries, each attached to the role or project that proves it.
 */
export default function Skills() {
  return (
    <Section id="skills" index="05" label="Skills · with proof">
      <div className="pb-24">
        <InView>
          <h3 className="u-display mb-3 max-w-[24ch] text-[1.75rem] text-bone sm:text-[2.5rem]">
            Twelve tools, each tied to something shipped.
          </h3>
          <p className="mb-10 max-w-[58ch] text-bone-dim">
            No proficiency bars. Each entry names what it was used for and links to
            the work that proves it.
          </p>
        </InView>

        <div className="space-y-10">
          {SKILL_GROUPS.map((g) => {
            const items = SKILLS.filter((s) => s.group === g);
            if (!items.length) return null;
            return (
              <div key={g}>
                <div className="mb-4 flex items-center gap-4">
                  <span className="u-mono text-latent">{g}</span>
                  <span className="u-rule flex-1" aria-hidden="true" />
                </div>
                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <li key={s.name} className="rounded-lg border border-bone/12 bg-void-lift/60 p-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="u-display text-[1.3125rem] text-bone">{s.name}</h4>
                        {s.share && (
                          <span className="u-mono text-amber" title="Measured from the GitHub languages API across all 28 public repositories">
                            {s.share}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-[0.9375rem] leading-[1.65] text-bone-dim">{s.use}</p>
                      <a
                        href={s.proofHref}
                        className="u-mono mt-3 inline-block text-ember underline decoration-ember/30 underline-offset-4"
                      >
                        {s.proof} →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

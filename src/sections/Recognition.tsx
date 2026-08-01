import Section from '../components/Section';
import InView from '../components/motion/InView';
import { AWARDS, HACKATHONS, PUBLICATIONS, HACKATHON_FRAMING, type Recognition as R } from '../data/record';

function Group({ title, items, accent }: { title: string; items: R[]; accent: string }) {
  return (
    <div>
      <p className={`u-mono mb-5 ${accent}`}>{title}</p>
      <ul className="space-y-4">
        {items.map((a) => (
          <li key={a.title} className="rounded-xl border border-bone/12 bg-void-lift/70 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h4 className="u-display text-[1.3125rem] text-bone">{a.title}</h4>
              <span className="u-mono text-bone-dim/70">
                {a.date}
              </span>
            </div>
            {a.placement && (
              <p className="u-mono mt-2 inline-block rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-amber">
                {a.placement}
              </p>
            )}
            <p className="u-mono mt-3 text-bone-dim/80">{a.org}</p>
            <p className="mt-3 text-[0.9375rem] leading-[1.7] text-bone-dim">
              {a.detail}
            </p>
            {a.url ? (
              <a
                href={a.url}
                target="_blank"
                rel="noreferrer noopener"
                className="u-mono mt-4 inline-block text-amber underline decoration-amber/35 underline-offset-4"
              >
                Verify ↗
              </a>
            ) : (
              <p className="u-mono mt-4 text-bone-dim/50">No public link available</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Awards, hackathon placements, and the publication as distinct typed groups. */
export default function Recognition() {
  return (
    <Section id="recognition" index="04" label="Recognition">
      <div className="pb-24">
        <InView>
          <h3 className="u-display mb-3 max-w-[24ch] text-[1.75rem] text-bone sm:text-[2.5rem]">
            {HACKATHON_FRAMING}
          </h3>
          <p className="mb-10 max-w-[58ch] text-bone-dim">
            Every entry below carries its date and, where one exists, an external link
            you can check.
          </p>
        </InView>

        <div className="grid gap-10 lg:grid-cols-3">
          <Group title="Awards" items={AWARDS} accent="text-amber" />
          <Group title="Hackathon placements" items={HACKATHONS} accent="text-ember" />
          <Group title="Publication" items={PUBLICATIONS} accent="text-latent" />
        </div>
      </div>
    </Section>
  );
}

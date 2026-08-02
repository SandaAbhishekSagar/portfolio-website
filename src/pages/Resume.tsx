import {
  PROFILE,
  EXPERIENCE,
  EDUCATION,
  AWARDS,
  HACKATHONS,
  PUBLICATIONS,
  PROJECTS,
  SKILLS,
  SKILL_GROUPS,
} from '../data/record';

/**
 * RESUME MODE — /resume
 *
 * The entire record collapsed into one print-ready, ATS-parseable page: real
 * <h1>/<h2>/<h3> headings, real lists, real text. No canvas, no colour
 * dependency, black on white when printed. Prerendered, so it parses with
 * JavaScript disabled — which is exactly how most resume scrapers read a page.
 */
export default function Resume() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-[52rem] px-8 py-12 print:px-0 print:py-0">
        <div className="mb-8 flex flex-wrap items-center gap-3 print:hidden">
          <a href="/" className="u-mono rounded border border-black/20 px-4 py-2 text-black">
            ← Back to site
          </a>
          <a
            href={PROFILE.resumePdf}
            download
            className="u-mono rounded bg-black px-4 py-2 text-white"
          >
            Download PDF
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="u-mono rounded border border-black/20 px-4 py-2 text-black"
          >
            Print / Save as PDF
          </button>
          <span className="u-mono text-black/50">Shortcut: press R anywhere on the site</span>
        </div>

        <header className="border-b-2 border-black pb-4">
          <h1 className="text-[2rem] font-bold leading-tight">{PROFILE.name}</h1>
          <p className="mt-1 text-[1.05rem]">{PROFILE.title}</p>
          <p className="mt-2 text-[0.9rem]">
            {PROFILE.location} ·{' '}
            <a href={`mailto:${PROFILE.email}`} className="underline">
              {PROFILE.email}
            </a>{' '}
            ·{' '}
            <a href={PROFILE.github} className="underline">
              github.com/SandaAbhishekSagar
            </a>{' '}
            ·{' '}
            <a href={PROFILE.linkedin} className="underline">
              linkedin.com/in/sandaabhisheksagar
            </a>
          </p>
          <p className="mt-2 text-[0.9rem] font-semibold">{PROFILE.availability}</p>
        </header>

        <section className="mt-6">
          <h2 className="text-[1.1rem] font-bold uppercase tracking-wide">Summary</h2>
          <p className="mt-2 text-[0.92rem] leading-relaxed">{PROFILE.summary}</p>
        </section>

        <section className="mt-6">
          <h2 className="border-b border-black/30 pb-1 text-[1.1rem] font-bold uppercase tracking-wide">
            Experience
          </h2>
          {EXPERIENCE.map((r) => (
            <div key={r.slug} className="mt-4 break-inside-avoid">
              <h3 className="text-[1rem] font-bold">
                {r.role} - {r.org}
                {r.orgNote ? ` (${r.orgNote})` : ''}
              </h3>
              <p className="text-[0.85rem] italic">
                {r.period} · {r.location}
              </p>
              <ul className="mt-1 list-disc pl-5 text-[0.9rem] leading-relaxed">
                {r.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="mt-1 text-[0.85rem]">
                <strong>Stack:</strong> {r.stack.join(', ')}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-6">
          <h2 className="border-b border-black/30 pb-1 text-[1.1rem] font-bold uppercase tracking-wide">
            Education
          </h2>
          {EDUCATION.map((e) => (
            <div key={e.degree} className="mt-3">
              <h3 className="text-[1rem] font-bold">{e.degree}</h3>
              <p className="text-[0.9rem]">
                {[e.school, e.location, e.date].filter(Boolean).join(' · ')}
              </p>
              {e.gpa && <p className="text-[0.85rem]">GPA {e.gpa}</p>}
            </div>
          ))}
        </section>

        <section className="mt-6">
          <h2 className="border-b border-black/30 pb-1 text-[1.1rem] font-bold uppercase tracking-wide">
            Awards and Recognition
          </h2>
          <ul className="mt-2 list-disc pl-5 text-[0.9rem] leading-relaxed">
            {[...AWARDS, ...HACKATHONS].map((a) => (
              <li key={a.title}>
                <strong>{a.title}</strong>
                {a.placement ? ` - ${a.placement}` : ''} · {a.org} · {a.date}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="border-b border-black/30 pb-1 text-[1.1rem] font-bold uppercase tracking-wide">
            Publications
          </h2>
          <ul className="mt-2 list-disc pl-5 text-[0.9rem] leading-relaxed">
            {PUBLICATIONS.map((p) => (
              <li key={p.title}>
                <strong>{p.title}</strong> · {p.org} · {p.date}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="border-b border-black/30 pb-1 text-[1.1rem] font-bold uppercase tracking-wide">
            Technical Skills
          </h2>
          <ul className="mt-2 text-[0.9rem] leading-relaxed">
            {SKILL_GROUPS.map((g) => {
              const items = SKILLS.filter((s) => s.group === g);
              if (!items.length) return null;
              return (
                <li key={g}>
                  <strong>{g}:</strong> {items.map((s) => s.name).join(', ')}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="border-b border-black/30 pb-1 text-[1.1rem] font-bold uppercase tracking-wide">
            Selected Projects
          </h2>
          {PROJECTS.slice(0, 6).map((p) => (
            <div key={p.slug} className="mt-3 break-inside-avoid">
              <h3 className="text-[0.95rem] font-bold">
                {p.title} - {p.metric.label}: {p.metric.value}
              </h3>
              <p className="text-[0.9rem] leading-relaxed">{p.summary}</p>
              <p className="text-[0.85rem]">
                {p.stack.join(', ')}
                {p.repo ? ` · ${p.repo}` : ''}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

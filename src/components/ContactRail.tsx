import { PROFILE } from '../data/record';

/**
 * Persistent contact rail. Fixed on desktop, a static block on mobile so it
 * never covers content. Present in the prerendered HTML, so it works with
 * JavaScript disabled.
 */
export default function ContactRail() {
  const items = [
    { href: `mailto:${PROFILE.email}`, label: 'Email', external: false },
    { href: PROFILE.github, label: 'GitHub', external: true },
    { href: PROFILE.linkedin, label: 'LinkedIn', external: true },
    { href: '/resume', label: 'Resume', external: false },
  ];

  return (
    <aside
      aria-label="Contact"
      className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
    >
      <div className="rounded-xl border border-bone/12 bg-void-lift/90 p-4 backdrop-blur-sm">
        <p className="u-mono mb-3 max-w-[11rem] text-ember">{PROFILE.availability}</p>
        <p className="u-mono mb-3 max-w-[11rem] break-all text-bone-dim/70">{PROFILE.email}</p>
        <ul className="space-y-2">
          {items.map((i) => (
            <li key={i.label}>
              <a
                href={i.href}
                {...(i.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                className="u-mono block text-bone-dim hover:text-amber"
              >
                {i.label} →
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

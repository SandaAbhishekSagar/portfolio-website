import { useEffect, useState } from 'react';
import ScrollProgress from './motion/ScrollProgress';

const LINKS = [
  { href: '/#work', label: 'Work' },
  { href: '/#about', label: 'About' },
  { href: '/ai-agent-engineer', label: 'AI Agent' },
  { href: '/#trajectory', label: 'Trajectory' },
  { href: '/#index', label: 'Ask' },
];

export default function TopBar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? 'bg-void/90 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[74rem] items-center justify-between gap-4 px-6 py-4 sm:px-10">
        <a href="/" className="u-mono text-bone hover:text-ember">
          A. S. Sanda
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="u-mono text-bone-dim hover:text-bone">
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="/#contact"
          className="u-mono rounded-full border border-amber/45 bg-amber/10 px-4 py-1.5 text-amber transition-colors hover:bg-amber hover:text-void"
        >
          Book a call
        </a>
      </div>
      <div className="h-px w-full bg-bone/8" aria-hidden="true">
        <ScrollProgress className="h-px w-full bg-gradient-to-r from-ember via-amber to-latent" />
      </div>
    </header>
  );
}

import type { ReactNode } from 'react';
import Spotlight from './Spotlight';

/**
 * GlowEffect / card surface — after ibelick/motion-primitives.
 *
 * The standard content surface: a bordered panel that warms under the cursor.
 * Every panel on the page uses this so the hover language is consistent, and
 * the light is scoped inside the card rather than washing the page.
 */
export default function GlowCard({
  children,
  className = '',
  tone = 'ember',
  spotlight = 300,
}: {
  children: ReactNode;
  className?: string;
  tone?: 'ember' | 'amber' | 'latent';
  spotlight?: number;
}) {
  const tones = {
    ember: { border: 'border-bone/14 hover:border-ember/35', glow: 'bg-ember/16' },
    amber: { border: 'border-amber/22 hover:border-amber/40', glow: 'bg-amber/16' },
    latent: { border: 'border-bone/14 hover:border-latent/40', glow: 'bg-latent/16' },
  }[tone];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-void-lift/85 transition-colors duration-300 ${tones.border} ${className}`}
    >
      <Spotlight size={spotlight} className={tones.glow} />
      <div className="relative">{children}</div>
    </div>
  );
}

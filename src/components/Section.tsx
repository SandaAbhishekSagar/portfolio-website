import type { ReactNode } from 'react';
import InView from './motion/InView';

/**
 * A section is a plain <section> with a real anchor id. No camera, no scene —
 * just measured vertical rhythm and a single reveal on entry.
 */
export default function Section({
  id,
  index,
  label,
  children,
  className = '',
}: {
  id: string;
  index: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-label`}
      className={`relative scroll-mt-20 border-t border-bone/8 ${className}`}
    >
      <div className="mx-auto w-full max-w-[74rem] px-6 sm:px-10">
        <InView>
          <div className="flex items-center gap-4 pt-20 pb-12">
            <span className="u-mono text-ember">{index}</span>
            <p id={`${id}-label`} className="u-mono text-bone-dim">
              {label}
            </p>
            <span className="u-rule flex-1" aria-hidden="true" />
          </div>
        </InView>
        {children}
      </div>
    </section>
  );
}

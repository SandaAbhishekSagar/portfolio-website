import type { ReactNode } from 'react';

/**
 * TextShimmer — after ibelick/motion-primitives.
 *
 * A slow warm sweep across a short label. Reserved for the availability line:
 * it is the one sentence that should catch a skimming recruiter's eye, and a
 * moving highlight earns attention without moving the layout.
 *
 * Pure CSS background-clip animation — no JS, and it stops under
 * prefers-reduced-motion via the global rule in index.css.
 */
export default function TextShimmer({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`bg-[linear-gradient(90deg,var(--color-bone-dim)_0%,var(--color-bone-dim)_35%,var(--color-amber)_50%,var(--color-bone-dim)_65%,var(--color-bone-dim)_100%)] bg-[length:220%_100%] bg-clip-text text-transparent [animation:shimmer_5.5s_linear_infinite] ${className}`}
    >
      {children}
    </span>
  );
}

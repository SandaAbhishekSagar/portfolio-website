import type { ReactNode } from 'react';

/**
 * InfiniteSlider — after ibelick/motion-primitives.
 *
 * A single-row marquee of the toolchain. Duplicated track for a seamless loop;
 * the duplicate is aria-hidden so the list is announced once. Pauses on hover
 * so anyone can actually read it, and the CSS animation is neutralised under
 * prefers-reduced-motion by the global rule, leaving a static row.
 */
export default function InfiniteSlider({
  children,
  duration = 42,
  className = '',
}: {
  children: ReactNode[];
  duration?: number;
  className?: string;
}) {
  const track = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-3 pr-3"
    >
      {children.map((c, i) => (
        <li key={i}>{c}</li>
      ))}
    </ul>
  );

  return (
    <div
      className={`group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] ${className}`}
    >
      <div
        className="flex w-max [animation:marquee_var(--dur)_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ ['--dur' as string]: `${duration}s` }}
      >
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}

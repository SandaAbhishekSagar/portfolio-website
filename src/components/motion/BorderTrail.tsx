import { motion, type Transition } from 'framer-motion';

/**
 * BorderTrail — after ibelick/motion-primitives.
 *
 * A single point of light walking the border of one element. Reserved for the
 * live retrieval station, where it means "this is running" — the only
 * continuously animated thing left on the page, so it reads as a status
 * indicator rather than decoration.
 */
export default function BorderTrail({
  size = 70,
  className = 'bg-ember',
  duration = 6,
}: {
  size?: number;
  className?: string;
  duration?: number;
}) {
  const transition: Transition = { repeat: Infinity, duration, ease: 'linear' };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] motion-reduce:hidden"
    >
      <motion.div
        className={`absolute aspect-square rounded-full blur-[3px] ${className}`}
        style={{ width: size, offsetPath: `rect(0 auto auto 0 round ${size}px)` }}
        animate={{ offsetDistance: ['0%', '100%'] }}
        transition={transition}
      />
    </div>
  );
}

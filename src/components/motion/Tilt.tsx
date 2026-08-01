import { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';

/**
 * Tilt — after ibelick/motion-primitives.
 *
 * The Spline / Peter Tarka lesson applied honestly: dimensionality belongs to
 * the object you are pointing at, not to the page background. A project card
 * leans toward the cursor and lifts; everything else stays flat and still.
 * Pointer-driven, so it costs zero frames until touched, and it is disabled
 * for coarse pointers and reduced-motion.
 */
export default function Tilt({
  children,
  className = '',
  rotation = 7,
  lift = 10,
}: {
  children: ReactNode;
  className?: string;
  rotation?: number;
  lift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const spring = { stiffness: 240, damping: 26, mass: 0.4 };
  const xs = useSpring(x, spring);
  const ys = useSpring(y, spring);

  const rotateX = useTransform(ys, [-0.5, 0.5], [rotation, -rotation]);
  const rotateY = useTransform(xs, [-0.5, 0.5], [-rotation, rotation]);
  const z = useTransform(ys, [-0.5, 0.5], [lift, lift]);

  const transform = useMotionTemplate`perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${z}px)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ transform, transformStyle: 'preserve-3d' }}
      className={`motion-reduce:!transform-none ${className}`}
    >
      {children}
    </motion.div>
  );
}

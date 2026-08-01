import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Magnetic — after ibelick/motion-primitives.
 * Applied only to the primary CTA. The one element that should feel like it
 * wants to be clicked leans toward the cursor.
 */
export default function Magnetic({
  children,
  intensity = 0.35,
  range = 110,
}: {
  children: ReactNode;
  intensity?: number;
  range?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.2 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist <= range) {
        const scale = 1 - dist / range;
        x.set(dx * intensity * scale);
        y.set(dy * intensity * scale);
        setActive(true);
      } else {
        x.set(0);
        y.set(0);
        setActive(false);
      }
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, [x, y, intensity, range]);

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className={`inline-block motion-reduce:!translate-x-0 motion-reduce:!translate-y-0 ${active ? '' : ''}`}
    >
      {children}
    </motion.div>
  );
}

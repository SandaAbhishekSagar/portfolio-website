import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * Spotlight — after ibelick/motion-primitives.
 *
 * A warm light that follows the cursor *inside a single card*, scoped to its
 * parent rather than the whole page. This is the replacement for the old
 * full-bleed background: light reveals the content you are reading instead of
 * competing with it.
 */
export default function Spotlight({
  size = 320,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [parent, setParent] = useState<HTMLElement | null>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useSpring(0, { bounce: 0, duration: 400 });
  const my = useSpring(0, { bounce: 0, duration: 400 });
  const left = useTransform(mx, (v) => `${v - size / 2}px`);
  const top = useTransform(my, (v) => `${v - size / 2}px`);

  useEffect(() => {
    const p = ref.current?.parentElement;
    if (!p) return;
    p.style.position = 'relative';
    p.style.overflow = 'hidden';
    setParent(p);
  }, []);

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    },
    [parent, mx, my]
  );

  useEffect(() => {
    if (!parent) return;
    const ac = new AbortController();
    const o = { signal: ac.signal };
    parent.addEventListener('mousemove', onMove, o);
    parent.addEventListener('mouseenter', () => setHovered(true), o);
    parent.addEventListener('mouseleave', () => setHovered(false), o);
    return () => ac.abort();
  }, [parent, onMove]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl transition-opacity duration-500 ${className}`}
      style={{ width: size, height: size, left, top }}
      animate={{ opacity: hovered ? 1 : 0 }}
    />
  );
}

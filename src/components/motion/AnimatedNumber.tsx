import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useSpring, useTransform } from 'framer-motion';

/**
 * Final value is always in the DOM (SSR/prerender/no-JS). After hydration,
 * when the metric enters view, we briefly count up from a high baseline —
 * never from zero, so crawlers never see "0+".
 */
export default function AnimatedNumber({
  value,
  className = '',
  suffix = '',
  prefix = '',
}: {
  value: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduceMotion = useReducedMotion();
  const [live, setLive] = useState(false);
  const spring = useSpring(value, { stiffness: 70, damping: 22, mass: 1 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());
  const formatted = value.toLocaleString();

  useEffect(() => {
    if (reduceMotion || !inView || live) return;
    setLive(true);
    const from = Math.max(0, Math.round(value * 0.72));
    spring.set(from);
    // Next frame: spring toward the final value.
    const id = requestAnimationFrame(() => spring.set(value));
    return () => cancelAnimationFrame(id);
  }, [inView, live, reduceMotion, spring, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {live ? <motion.span>{display}</motion.span> : <span>{formatted}</span>}
      {suffix}
    </span>
  );
}

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useSpring, useTransform } from 'framer-motion';

/**
 * AnimatedNumber — after ibelick/motion-primitives.
 * The final value is what renders server-side, so crawlers and JS-disabled
 * visitors read the real metric instead of a zero. The count-up only starts
 * after hydration, once the metric scrolls into view.
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
  const [counting, setCounting] = useState(false);
  const spring = useSpring(0, { stiffness: 70, damping: 22, mass: 1 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (reduceMotion || !inView) return;
    const frame = requestAnimationFrame(() => {
      setCounting(true);
      spring.set(value);
    });
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, spring, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {counting ? (
        <motion.span>{display}</motion.span>
      ) : (
        <span>{value.toLocaleString()}</span>
      )}
      {suffix}
    </span>
  );
}

import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * AnimatedNumber — after ibelick/motion-primitives.
 * Metrics count to their value once on reveal. Mono figures deserve the
 * emphasis; this is where a recruiter's eye should land.
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
  const spring = useSpring(0, { stiffness: 70, damping: 22, mass: 1 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

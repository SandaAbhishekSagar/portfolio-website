import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgress — after ibelick/motion-primitives.
 * A one-pixel spring-damped rule. The only global motion left on the page.
 */
export default function ScrollProgress({ className = '' }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className={className}
    />
  );
}

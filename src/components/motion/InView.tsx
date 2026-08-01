import { useRef, type ReactNode, type ElementType } from 'react';
import { motion, useInView, type Variants, type Transition } from 'framer-motion';

/**
 * InView — after ibelick/motion-primitives.
 * Reveals content once when it enters the viewport. Used for section entrances
 * instead of a background animation: the *content* is what moves, briefly, and
 * then it holds still and stays readable.
 */
const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export default function InView({
  children,
  variants = defaultVariants,
  transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  as = 'div',
  className,
  margin = '-12% 0px -12% 0px',
}: {
  children: ReactNode;
  variants?: Variants;
  transition?: Transition;
  as?: ElementType;
  className?: string;
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: margin as never });
  const M = motion[as as 'div'];

  return (
    <M
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
    >
      {children}
    </M>
  );
}

import { motion, type Variants } from 'framer-motion';

/**
 * TextEffect — after ibelick/motion-primitives, `per="word"` only.
 *
 * Deliberately word-level, never per-character: letter-by-letter assembly was
 * explicitly ruled out, and words keep the line readable the whole way through.
 * The full string is always present in the DOM for search and screen readers.
 */
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: '0.35em', filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function TextEffect({
  children,
  className,
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const words = children.split(' ');

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      transition={{ delayChildren: delay }}
      aria-label={children}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          variants={word}
          aria-hidden="true"
          className="inline-block whitespace-pre"
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
}

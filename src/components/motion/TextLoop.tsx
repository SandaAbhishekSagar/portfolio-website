import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * TextLoop — after ibelick/motion-primitives.
 *
 * Cycles one short phrase in a fixed slot. Used for the roles he is open to,
 * so a recruiter reads the fit without a paragraph. The full list is rendered
 * for screen readers and search; only the visible slot animates.
 */
export default function TextLoop({
  items,
  interval = 2600,
  className = '',
}: {
  items: string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (items.length < 2) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % items.length), interval);
    return () => window.clearInterval(id);
  }, [items.length, interval]);

  return (
    <span className={`relative inline-block align-bottom ${className}`}>
      {/* accessible full list, visually hidden */}
      <span className="sr-only">{items.join(', ')}</span>
      <span aria-hidden="true" className="inline-block">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={items[i]}
            initial={{ opacity: 0, y: '0.5em' }}
            animate={{ opacity: 1, y: '0em' }}
            exit={{ opacity: 0, y: '-0.5em' }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block whitespace-nowrap"
          >
            {items[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

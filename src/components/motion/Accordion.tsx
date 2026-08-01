import { useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type AccordionItem = { q: string; a: ReactNode };

/**
 * Accordion / Disclosure — after ibelick/motion-primitives.
 *
 * Height-animated disclosure for the questions a hiring manager actually has
 * (visa, start date, remote, what he wants next). Answering them inline
 * removes the main reason someone closes the tab instead of writing.
 *
 * Native <button> + aria-expanded + aria-controls, so keyboard and screen
 * reader behaviour is correct and the answers are findable with Cmd+F when
 * open.
 */
export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <ul className="border-t border-bone/10">
      {items.map((it, i) => {
        const isOpen = open === i;
        const panelId = `${base}-panel-${i}`;
        const btnId = `${base}-btn-${i}`;
        return (
          <li key={it.q} className="border-b border-bone/10">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-ember"
              >
                <span className="u-display text-[1.3125rem] text-bone">{it.q}</span>
                <span
                  aria-hidden="true"
                  className={`u-mono shrink-0 text-ember transition-transform duration-300 ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pr-10 text-[0.9375rem] leading-[1.7] text-bone-dim">
                    {it.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

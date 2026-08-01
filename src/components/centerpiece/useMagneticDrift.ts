import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * THE SHARED INTERACTION RIG
 * ─────────────────────────────────────────────────────────────────────────────
 * Identical across all three centerpiece modes, so an asset can be swapped
 * without touching a line of interaction code. It produces two things:
 *
 *   1. `driftStyle` — a translate3d nudge applied to the OUTER wrapper, so the
 *      whole object leans toward the cursor once it enters a padding radius.
 *      Offset is divided by a strength factor, never tracking the cursor 1:1.
 *      0.3s ease-out on enter, 0.6s ease-in-out on leave, willChange: transform.
 *
 *   2. `pointer` — a live, spring-eased normalised offset in the range
 *      roughly -0.5..0.5 on each axis. Modes map this to camera yaw/pitch
 *      (capped at 3° / 2°) or to a CSS parallax. It is a ref, so consumers read
 *      it inside a render loop without triggering React updates.
 *
 * Gates, applied here once rather than in each mode:
 *   - pointer-fine only. Coarse pointers get a completely static object.
 *   - prefers-reduced-motion gets a completely static object.
 *   - the visual layer never intercepts clicks (pointerEvents none is applied
 *     by the modes; this hook only reads global pointer position).
 */

export const YAW_LIMIT_DEG = 3;
export const PITCH_LIMIT_DEG = 2;

export type DriftOptions = {
  /** How far outside the element the cursor starts to pull it, in px. */
  padding?: number;
  /** Larger = less movement. Offset is divided by this. */
  strength?: number;
  /** Max wrapper travel in px on each axis. */
  maxTravel?: number;
};

export type PointerState = { x: number; y: number };

export function useMagneticDrift<T extends HTMLElement = HTMLDivElement>(
  options: DriftOptions = {}
) {
  const { padding = 120, strength = 14, maxTravel = 16 } = options;

  const ref = useRef<T>(null);
  const [enabled, setEnabled] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [offset, setOffset] = useState<PointerState>({ x: 0, y: 0 });

  /** Spring-eased normalised pointer, read by render loops. Never re-renders. */
  const pointer = useRef<PointerState>({ x: 0, y: 0 });
  const pointerTarget = useRef<PointerState>({ x: 0, y: 0 });

  // Capability gate: fine pointer, no reduced-motion preference.
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const evaluate = () => setEnabled(fine.matches && !reduced.matches);
    evaluate();

    fine.addEventListener('change', evaluate);
    reduced.addEventListener('change', evaluate);
    return () => {
      fine.removeEventListener('change', evaluate);
      reduced.removeEventListener('change', evaluate);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      pointer.current = { x: 0, y: 0 };
      pointerTarget.current = { x: 0, y: 0 };
      setOffset({ x: 0, y: 0 });
      setEngaged(false);
      return;
    }

    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;

      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // inside the padded box?
      const withinX = Math.abs(dx) <= r.width / 2 + padding;
      const withinY = Math.abs(dy) <= r.height / 2 + padding;

      if (withinX && withinY) {
        setEngaged(true);
        setOffset({
          x: clamp(dx / strength, -maxTravel, maxTravel),
          y: clamp(dy / strength, -maxTravel, maxTravel),
        });
        pointerTarget.current = {
          x: clamp(dx / (r.width / 2), -1, 1) * 0.5,
          y: clamp(dy / (r.height / 2), -1, 1) * 0.5,
        };
      } else if (engaged) {
        setEngaged(false);
        setOffset({ x: 0, y: 0 });
        pointerTarget.current = { x: 0, y: 0 };
      }
    };

    const onLeave = () => {
      setEngaged(false);
      setOffset({ x: 0, y: 0 });
      pointerTarget.current = { x: 0, y: 0 };
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, engaged, padding, strength, maxTravel]);

  // Spring toward the target. One rAF for the whole rig, only while engaged or
  // still settling, so an idle centerpiece costs nothing.
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = 1 - Math.pow(0.0001, dt); // critically-damped feel
      pointer.current = {
        x: pointer.current.x + (pointerTarget.current.x - pointer.current.x) * k,
        y: pointer.current.y + (pointerTarget.current.y - pointer.current.y) * k,
      };
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  const driftStyle = useMemo<React.CSSProperties>(() => {
    if (!enabled) return {};
    return {
      transform: `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0)`,
      transition: engaged
        ? 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        : 'transform 0.6s cubic-bezier(0.45, 0, 0.55, 1)',
      willChange: 'transform',
    };
  }, [enabled, engaged, offset.x, offset.y]);

  return { ref, driftStyle, pointer, enabled, engaged };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

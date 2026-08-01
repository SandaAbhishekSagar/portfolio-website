import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';

const Canvas3D = lazy(() => import('./Canvas3D'));

/**
 * SPLINE STAGE — a contained 3D viewport, never a page background.
 *
 * This is the Spline lesson applied with restraint. Spline scenes are objects
 * you place *in* a layout: framed, lit, finite. So every 3D element on this
 * site lives inside a fixed-size stage that:
 *
 *   - only mounts when scrolled into view (IntersectionObserver)
 *   - unmounts / pauses when scrolled away, so it costs nothing off-screen
 *   - renders nothing at all for reduced-motion or missing WebGL, falling back
 *     to a static CSS render of the same form
 *   - is aria-hidden, because it is decoration — all information is DOM text
 *
 * Result: dimensionality where the eye is already looking, and a completely
 * quiet page everywhere else.
 */
export default function SplineStage({
  className = '',
  fallback,
  children,
  height = 200,
  interactive = false,
}: {
  className?: string;
  fallback: ReactNode;
  children: ReactNode;
  height?: number;
  /** Let the canvas receive pointer events (drag-to-rotate stages). */
  interactive?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    try {
      const c = document.createElement('canvas');
      if (!c.getContext('webgl2') && !c.getContext('webgl')) return;
    } catch {
      return;
    }
    setAllowed(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !allowed) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '120px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [allowed]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* The static form is the reduced/static tier and prevents layout shift
          before the canvas mounts. It fades out once the canvas is live —
          otherwise the CSS bars show through the transparent WebGL background
          and read as a rendering artefact. */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          allowed && visible ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {fallback}
      </div>

      {allowed && visible && (
        <Suspense fallback={null}>
          <Canvas3D interactive={interactive}>{children}</Canvas3D>
        </Suspense>
      )}
    </div>
  );
}

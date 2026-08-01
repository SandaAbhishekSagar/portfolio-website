import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { useMagneticDrift } from './useMagneticDrift';
import { portrait, bust } from './manifest';

const ModePortrait = lazy(() => import('./ModePortrait'));
const ModeBust = lazy(() => import('./ModeBust'));
const ModeWaveform = lazy(() => import('./ModeWaveform'));

/**
 * CENTERPIECE SLOT
 * ─────────────────────────────────────────────────────────────────────────────
 * One swappable component, three asset modes behind a single `mode` prop.
 * Assets can arrive in any order; nothing here blocks on a particular one.
 *
 *   mode="portrait"  MODE A — depth-displaced photograph (default)
 *   mode="bust"      MODE B — stylized GLB bust
 *   mode="waveform"  MODE C — procedural waveform, zero assets
 *   mode="auto"      resolve to the best mode the manifest can actually satisfy
 *
 * RESOLUTION IS DEFENSIVE. Requesting a mode whose asset is absent from the
 * manifest degrades to Mode C rather than rendering a broken plate or a
 * third-party stand-in. That is what makes the default safe to ship today:
 * `mode="portrait"` is wired as the default, and until a real licence-cleared
 * photograph of Abhishek exists it resolves to the procedural waveform.
 *
 * SHARED RIG. All three modes receive the identical pointer ref from
 * useMagneticDrift, so swapping an asset never touches interaction code.
 *
 * GATES, applied once here for every mode:
 *   - IntersectionObserver: nothing renders while off-screen.
 *   - Mounts only after first paint (rAF ×2 + timer), so the centerpiece can
 *     never contribute to LCP and hero text always paints first.
 *   - No WebGL2/WebGL, or prefers-reduced-motion → the static frame only.
 *   - pointerEvents: none on every visual layer, so clicks pass through.
 *   - aria-hidden on all canvas layers; the text equivalent is a real <p> in
 *     the DOM, and the slot is skipped entirely by keyboard navigation.
 */

export type CenterpieceMode = 'auto' | 'portrait' | 'bust' | 'waveform';
type Resolved = 'portrait' | 'bust' | 'waveform';

function resolveMode(requested: CenterpieceMode): Resolved {
  if (requested === 'bust') return bust ? 'bust' : 'waveform';
  if (requested === 'portrait') return portrait ? 'portrait' : 'waveform';
  if (requested === 'auto') {
    if (portrait) return 'portrait';
    if (bust) return 'bust';
    return 'waveform';
  }
  return 'waveform';
}

/**
 * The text equivalent. Whatever renders visually, this is what a screen reader,
 * a search engine and a no-JS visitor get. No information lives only in the
 * canvas, so this is a complete substitute rather than a caption.
 */
const DESCRIPTIONS: Record<Resolved, string> = {
  portrait:
    portrait?.alt ??
    'Abhishek Sagar Sanda, applied AI engineer, Boston.',
  bust: bust?.alt ?? 'A faceted low-poly bust of Abhishek Sagar Sanda, wireframe over solid.',
  waveform:
    'A three-quarter view of a live audio waveform: 88 bars whose heights plot an ' +
    'amplitude-modulated sine sum, the signal a voice agent works on.',
};

export default function CenterpieceSlot({
  mode = 'portrait',
  height = 380,
  caption,
  className = '',
}: {
  mode?: CenterpieceMode;
  height?: number;
  caption?: ReactNode;
  className?: string;
}) {
  const resolved = resolveMode(mode);
  const { ref, driftStyle, pointer } = useMagneticDrift<HTMLDivElement>({
    padding: 130,
    strength: 16,
    maxTravel: 14,
  });

  const [allowed, setAllowed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [painted, setPainted] = useState(false);
  const [bustFellBack, setBustFellBack] = useState(false);
  const onBustFallback = useRef(() => setBustFellBack(true)).current;

  // Capability gate.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      const c = document.createElement('canvas');
      if (!c.getContext('webgl2') && !c.getContext('webgl')) return;
    } catch {
      return;
    }
    setAllowed(true);
  }, []);

  // Never before first paint: two frames plus a short ceiling. requestIdleCallback
  // is deliberately avoided — it can be starved indefinitely during scrolling.
  useEffect(() => {
    let timer = 0;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        timer = window.setTimeout(() => setPainted(true), 180);
      })
    );
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  // Off-screen costs nothing.
  useEffect(() => {
    const el = ref.current;
    if (!el || !allowed) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '140px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [allowed, ref]);

  const live = allowed && visible && painted;
  const effective: Resolved = resolved === 'bust' && bustFellBack ? 'waveform' : resolved;

  return (
    <figure className={`relative m-0 ${className}`}>
      <div
        ref={ref}
        style={driftStyle}
        className="relative rounded-xl border border-bone/14 bg-void-lift/70 p-1"
      >
        <Tick className="left-1.5 top-1.5 border-l border-t" />
        <Tick className="right-1.5 top-1.5 border-r border-t" />
        <Tick className="bottom-1.5 left-1.5 border-b border-l" />
        <Tick className="bottom-1.5 right-1.5 border-b border-r" />

        <div className="flex items-center justify-between px-3 pb-2 pt-2">
          <span className="u-mono text-ember">
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-ember align-middle" />
            {effective === 'waveform' ? 'signal' : 'subject'}
          </span>
          <span className="u-mono text-bone-dim/60">
            {effective === 'portrait'
              ? 'depth · parallax'
              : effective === 'bust'
                ? 'glb · wireframe'
                : 'am · sine sum'}
          </span>
        </div>

        {/* The visual layer. pointer-events-none so nothing behind it is blocked. */}
        <div
          className="relative overflow-hidden rounded-lg bg-void/40"
          style={{ height }}
          aria-hidden="true"
        >
          <StaticFrame mode={effective} live={live} />

          {live && (
            <Suspense fallback={null}>
              {effective === 'portrait' && portrait && (
                <ModePortrait asset={portrait} pointer={pointer} />
              )}
              {effective === 'bust' && bust && (
                <ModeBust asset={bust} pointer={pointer} onFallback={onBustFallback} />
              )}
              {effective === 'waveform' && <ModeWaveform pointer={pointer} />}
            </Suspense>
          )}
        </div>

        <div className="flex items-center justify-between px-3 pb-2 pt-2">
          <span className="u-mono text-bone-dim/60">
            {effective === 'waveform' ? '88 bars' : 'single draw call'}
          </span>
          <span className="u-mono text-bone-dim/60">three-quarter view</span>
        </div>
      </div>

      {/* The text equivalent — a real DOM paragraph, never only in the canvas. */}
      <figcaption className="u-mono mt-3 text-bone-dim/60">
        {caption ?? DESCRIPTIONS[effective]}
      </figcaption>
    </figure>
  );
}

function Tick({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-2.5 w-2.5 border-ember/45 ${className}`}
    />
  );
}

/**
 * The static tier, and the pre-canvas frame. Drawn in CSS from the same sine
 * sum the waveform mode renders, so the reduced/static experience is the same
 * form rather than an empty box. Fades out once the canvas is live.
 */
function StaticFrame({ mode, live }: { mode: Resolved; live: boolean }) {
  const bars = Array.from({ length: 34 }, (_, i) => {
    const x = (i / 33 - 0.5) * 7.4;
    const env = 0.35 + 0.65 * Math.exp(-Math.abs(x) / 3.1);
    const sum =
      Math.sin(x * 1.5) * 0.9 + Math.sin(x * 3.4) * 0.4 + Math.sin(x * 0.7) * 0.28;
    return Math.max(7, Math.abs(sum) * env * 62);
  });

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 transition-opacity duration-500 ${
        live ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {mode === 'portrait' && portrait ? (
        // The real plate, flat. Correct even with no WebGL and no JS.
        <img
          src={portrait.color}
          alt=""
          width={1024}
          height={1280}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-90"
        />
      ) : (
        <div className="flex h-full w-full items-end justify-center gap-1 px-6 pb-10">
          {bars.map((h, i) => (
            <span
              key={i}
              className="w-1.5 rounded-sm bg-gradient-to-t from-ember/30 to-amber/75"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

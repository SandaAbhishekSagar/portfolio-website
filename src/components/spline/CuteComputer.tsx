import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { Application } from '@splinetool/runtime';

/**
 * CUTE COMPUTER — native Spline Code Export embed.
 *
 * Whole-page cursor follow via setGlobalEvents(true).
 * Panel fill via runtime setZoom + light CSS overscan.
 * "Built with Spline" watermark: runtime loads SplineWatermark async after
 * onLoad and calls pipeline.setWatermark(texture) — we stub that setter.
 */

const SCENE =
  'https://prod.spline.design/QyQ-VzvDbXAfn9Lh/scene.splinecode';

/** Export camera; panel fill is CSS overscan so cursor-follow still works. */
const SCENE_ZOOM = 1;

const Spline = lazy(() => import('@splinetool/react-spline'));

function StaticDesk() {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center"
      style={{
        background:
          'radial-gradient(18rem 14rem at 50% 55%, rgba(255,138,91,0.14), transparent 70%)',
      }}
    >
      <span className="u-mono text-bone-dim/50">loading scene…</span>
    </div>
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

type LogoPass = {
  enabled: boolean;
  render?: (...args: unknown[]) => void;
};

type SplinePipeline = {
  setWatermark?: (v: unknown) => void;
  logoOverlayPass?: LogoPass;
  _isUIOverlayEnabled?: boolean;
};

/** Block the async free-plan watermark that arrives after scene parse. */
function stripSplineWatermark(app: Application, root: HTMLElement | null) {
  try {
    const pipeline = (
      app as unknown as { _renderer?: { pipeline?: SplinePipeline } }
    )._renderer?.pipeline;

    if (pipeline) {
      pipeline.setWatermark = () => {
        if (pipeline.logoOverlayPass) {
          pipeline.logoOverlayPass.enabled = false;
          pipeline.logoOverlayPass.render = () => {};
        }
      };
      pipeline.setWatermark(null);
      pipeline._isUIOverlayEnabled = false;
      if (pipeline.logoOverlayPass) {
        pipeline.logoOverlayPass.enabled = false;
        pipeline.logoOverlayPass.render = () => {};
      }
    }
  } catch {
    /* private API — fine if it moves */
  }

  if (!root) return;
  root.querySelectorAll('a[href*="spline.design"]').forEach((el) => el.remove());
}

/** Aim follow at the panel center so the subject isn't parked off-frame. */
function aimFollowAtPanel(root: HTMLElement | null) {
  if (!root) return;
  const r = root.getBoundingClientRect();
  const clientX = r.left + r.width / 2;
  const clientY = r.top + r.height / 2;
  const opts: MouseEventInit = {
    clientX,
    clientY,
    bubbles: true,
    cancelable: true,
    view: window,
  };
  window.dispatchEvent(new MouseEvent('pointermove', opts));
  window.dispatchEvent(new MouseEvent('mousemove', opts));
}

export default function CuteComputer({ height = 480 }: { height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const [live, setLive] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLive(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Re-assert the stub while the watermark asset may still be loading.
  useEffect(() => {
    if (!loaded) return;
    const el = ref.current;
    const kill = () => {
      if (appRef.current) stripSplineWatermark(appRef.current, el);
    };
    kill();
    const timers = [200, 600, 1500, 3000].map((ms) => window.setTimeout(kill, ms));
    const mo = el ? new MutationObserver(kill) : null;
    mo?.observe(el!, { childList: true, subtree: true });
    return () => {
      timers.forEach(clearTimeout);
      mo?.disconnect();
    };
  }, [loaded]);

  // Keep a sane aim when the section scrolls into view (global follow uses last mouse).
  useEffect(() => {
    if (!loaded) return;
    const el = ref.current;
    if (!el) return;
    const sync = () => {
      appRef.current?.setZoom(SCENE_ZOOM);
      aimFollowAtPanel(el);
    };
    sync();
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) sync();
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loaded]);

  const onLoad = (app: Application) => {
    appRef.current = app;
    // Stub watermark BEFORE the async SplineWatermark asset resolves.
    stripSplineWatermark(app, ref.current);
    app.setBackgroundColor('transparent');
    app.setZoom(SCENE_ZOOM);
    // Seed aim at the panel, then enable whole-page cursor follow.
    aimFollowAtPanel(ref.current);
    app.setGlobalEvents(true);
    requestAnimationFrame(() => {
      aimFollowAtPanel(ref.current);
      stripSplineWatermark(app, ref.current);
    });
    setLoaded(true);
  };

  return (
    <figure className="relative m-0">
      <div className="relative rounded-xl border border-bone/14 bg-void-lift/70 p-1">
        <Tick className="left-1.5 top-1.5 border-l border-t" />
        <Tick className="right-1.5 top-1.5 border-r border-t" />
        <Tick className="bottom-1.5 left-1.5 border-b border-l" />
        <Tick className="bottom-1.5 right-1.5 border-b border-r" />

        <div className="flex items-center justify-between px-3 pb-2 pt-2">
          <span className="u-mono text-ember">
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] animate-pulse rounded-full bg-ember align-middle" />
            desk scene
          </span>
          <span className="u-mono text-bone-dim/60">global follow</span>
        </div>

        <div
          ref={ref}
          className="spline-desk relative isolate overflow-hidden rounded-lg bg-black"
          style={{ height }}
        >
          <div
            className={`absolute inset-0 z-[1] transition-opacity duration-500 ${
              live && loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <StaticDesk />
          </div>

          {live && (
            <Suspense fallback={null}>
              <Spline
                scene={SCENE}
                onLoad={onLoad}
                className="spline-desk-canvas"
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent',
                }}
              />
            </Suspense>
          )}

          {/* Soft cover for free-plan canvas watermark if the stub misses a frame. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 z-10 h-11 w-36"
            style={{
              background:
                'linear-gradient(225deg, transparent 35%, #000 72%)',
            }}
          />
        </div>

        <div className="flex items-center justify-between px-3 pb-2 pt-2">
          <span className="u-mono text-bone-dim/60">spline · code export</span>
          <span className="u-mono text-bone-dim/60">cursor = whole page</span>
        </div>
      </div>

      <figcaption className="u-mono mt-3 text-bone-dim/60">
        Cute Computer · follows your cursor anywhere on the page
      </figcaption>
    </figure>
  );
}

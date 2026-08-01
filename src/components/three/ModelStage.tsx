import { useEffect, useState } from 'react';
import SplineStage from '../spline/SplineStage';
import HeroModel from './HeroModel';

/**
 * MODEL STAGE — the hero specimen in a framed, instrumented panel.
 *
 * Same panel language as the rest of the site (corner ticks, mono readouts):
 * the 3D is an object placed in the layout, never a background. This stage is
 * the one interactive canvas on the page — the viewer can grab the model and
 * spin it — so the readouts double as an invitation and a spec sheet.
 *
 * Tiers are inherited from SplineStage: reduced-motion and no-WebGL visitors
 * get the static glow fallback and lose nothing that carries information.
 */

/** The static tier: a quiet ember glow where the object would sit. */
function StaticGlow() {
  return (
    <div
      aria-hidden="true"
      className="relative h-full w-full"
      style={{
        background:
          'radial-gradient(16rem 20rem at 50% 55%, rgba(255,138,91,0.16), transparent 70%)',
      }}
    >
      <span className="u-mono absolute inset-x-0 bottom-8 text-center text-bone-dim/50">
        3d specimen · webgl off
      </span>
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

export default function ModelStage() {
  const [height, setHeight] = useState(320);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setHeight(mq.matches ? 420 : 280);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <figure className="relative m-0">
      <div className="relative rounded-xl border border-bone/14 bg-void-lift/70 p-1">
        {/* corner ticks — the panel reads as instrumentation */}
        <Tick className="left-1.5 top-1.5 border-l border-t" />
        <Tick className="right-1.5 top-1.5 border-r border-t" />
        <Tick className="bottom-1.5 left-1.5 border-b border-l" />
        <Tick className="bottom-1.5 right-1.5 border-b border-r" />

        <div className="flex items-center justify-between px-3 pb-2 pt-2">
          <span className="u-mono text-ember">
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] animate-pulse rounded-full bg-ember align-middle" />
            specimen 001
          </span>
          <span className="u-mono text-bone-dim/60">drag · rotate</span>
        </div>

        <SplineStage
          height={height}
          interactive
          className="cursor-grab rounded-lg bg-void/40 active:cursor-grabbing"
          fallback={<StaticGlow />}
        >
          <HeroModel />
        </SplineStage>

        <div className="flex items-center justify-between px-3 pb-2 pt-2">
          <span className="u-mono text-bone-dim/60">11.7k tris · 250 kb</span>
          <span className="u-mono text-bone-dim/60">meshopt · webp</span>
        </div>
      </div>

      <figcaption className="u-mono mt-3 text-bone-dim/60">
        Live 3D scan · grab it, fling it — the spring brings it home
      </figcaption>
    </figure>
  );
}

import SplineStage from '../spline/SplineStage';
import ClonerLattice from './ClonerLattice';

/**
 * SIGNAL STAGE — a bounded instrument panel, not a background.
 *
 * The 3D lives inside a framed panel beside the copy, so nothing ever competes
 * with the text. Corner ticks and a mono readout frame it as measurement
 * apparatus rather than ornament.
 *
 * All mounting, tiering and unmounting is delegated to SplineStage
 * (IntersectionObserver + reduced-motion + WebGL check + static fallback).
 */

/** The static tier: the same sine sum drawn as CSS bars. Never empty. */
function StaticBars() {
  const bars = Array.from({ length: 32 }, (_, i) => {
    const x = i * 0.26;
    const sum =
      Math.sin(x * 1.6) + Math.sin(x * 3.0) * 0.45 + Math.sin(x * 0.7) * 0.3;
    const envelope = 0.5 + 0.5 * Math.sin(x * 0.55);
    return Math.abs(sum * envelope) * 62;
  });

  return (
    <div
      aria-hidden="true"
      className="flex h-full w-full items-end justify-center gap-1 px-6 pb-10"
    >
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-1.5 rounded-sm bg-gradient-to-t from-ember/30 to-amber/75"
          style={{ height: `${Math.max(6, h)}%` }}
        />
      ))}
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

export default function SignalStage() {
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
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-ember align-middle" />
            signal in
          </span>
          <span className="u-mono text-bone-dim/60">am · sine sum</span>
        </div>

        <SplineStage
          height={300}
          className="rounded-lg bg-void/40"
          fallback={<StaticBars />}
        >
          <ClonerLattice />
        </SplineStage>

        <div className="flex items-center justify-between px-3 pb-2 pt-2">
          <span className="u-mono text-bone-dim/60">400 clones</span>
          <span className="u-mono text-bone-dim/60">20 × 20 grid</span>
        </div>
      </div>

      <figcaption className="u-mono mt-3 text-bone-dim/60">
        Amplitude-modulated sine sum · height plots the signal · press the surface
      </figcaption>
    </figure>
  );
}

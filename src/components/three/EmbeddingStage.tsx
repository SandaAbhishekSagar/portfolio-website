import SplineStage from '../spline/SplineStage';
import EmbeddingLattice from './EmbeddingLattice';

/**
 * The retrieval instrument, framed exactly like the hero panel so the two read
 * as a matched pair of instruments — signal in, index queried.
 */

/** Static tier: the four clusters drawn as a CSS scatter. Never empty. */
function StaticScatter() {
  let s = 4242;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const centers = [
    [30, 32],
    [70, 36],
    [32, 70],
    [70, 68],
  ];
  const dots = centers.flatMap(([cx, cy], c) =>
    Array.from({ length: 26 }, () => ({
      x: cx + (rnd() + rnd() - 1) * 13,
      y: cy + (rnd() + rnd() - 1) * 13,
      c,
    }))
  );

  return (
    <div aria-hidden="true" className="relative h-full w-full">
      {dots.map((d, i) => (
        <span
          key={i}
          className={`absolute h-1.5 w-1.5 rounded-full ${
            d.c === 1 ? 'bg-amber/70' : 'bg-ember/45'
          }`}
          style={{ left: `${d.x}%`, top: `${d.y}%` }}
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

export default function EmbeddingStage() {
  return (
    <figure className="relative m-0">
      <div className="relative rounded-xl border border-bone/14 bg-void-lift/70 p-1">
        <Tick className="left-1.5 top-1.5 border-l border-t" />
        <Tick className="right-1.5 top-1.5 border-r border-t" />
        <Tick className="bottom-1.5 left-1.5 border-b border-l" />
        <Tick className="bottom-1.5 right-1.5 border-b border-r" />

        <div className="flex items-center justify-between px-3 pb-2 pt-2">
          <span className="u-mono text-ember">
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-ember align-middle" />
            embedding space
          </span>
          <span className="u-mono text-bone-dim/60">k-nearest</span>
        </div>

        <SplineStage
          height={272}
          className="rounded-lg bg-void/40"
          fallback={<StaticScatter />}
        >
          <EmbeddingLattice />
        </SplineStage>

        <div className="flex items-center justify-between px-3 pb-2 pt-2">
          <span className="u-mono text-bone-dim/60">400 vectors</span>
          <span className="u-mono text-bone-dim/60">4 domains</span>
        </div>
      </div>

      <figcaption className="u-mono mt-3 text-bone-dim/60">
        Your cursor is the query · the nearest cluster is retrieved
      </figcaption>
    </figure>
  );
}

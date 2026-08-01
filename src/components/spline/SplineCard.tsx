import { useMemo } from 'react';
import SplineStage from './SplineStage';
import { DomainObject, DOMAIN_STYLE, type Domain } from './objects';

/**
 * The 3D header strip inside a project detail panel.
 *
 * Each engineering domain gets its own solid: voice → a torus knot (a signal
 * looped through itself), retrieval → an icosahedron (a clustered index),
 * vision → a rounded box lens array, systems → interlocking rings. The object
 * is a label you can read at a glance, not ornament.
 */
export default function SplineCard({ cluster }: { cluster: string }) {
  const domain = (['voice', 'retrieval', 'vision', 'systems'].includes(cluster)
    ? cluster
    : 'systems') as Domain;

  const style = DOMAIN_STYLE[domain];

  const fallback = useMemo(
    () => (
      <div
        className="h-full w-full"
        style={{
          background: `radial-gradient(15rem 9rem at 50% 120%, ${style.glow}, transparent 70%)`,
        }}
      />
    ),
    [style.glow]
  );

  return (
    <div className="relative border-b border-bone/10 bg-gradient-to-b from-void-edge/60 to-transparent">
      <SplineStage height={168} fallback={fallback}>
        <DomainObject domain={domain} />
      </SplineStage>
    </div>
  );
}

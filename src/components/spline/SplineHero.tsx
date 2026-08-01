import ModelStage from '../three/ModelStage';

/**
 * The hero object. A real, grabbable 3D scan in its own column beside the
 * headline — never behind the text.
 *
 * This replaced the cloner lattice (which itself replaced a rotating torus
 * knot). The lattice rewarded a hover; the scan rewards a grab: viewers can
 * drag, fling and spin the model with spring physics, which makes the hero the
 * one place on the page that answers the hand rather than just the eye. The
 * asset itself is an argument — a 73 MB export shipped at ~250 KB via meshopt
 * and WebP, with the numbers printed on the panel.
 */
export default function SplineHero() {
  return (
    <div className="relative mx-auto w-full max-w-[22rem] md:mx-0 md:max-w-none">
      <ModelStage />
    </div>
  );
}

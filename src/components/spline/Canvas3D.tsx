import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';

/**
 * The shared canvas for every contained Spline-style stage.
 *
 * Uses explicit lights plus standard materials rather than custom GLSL: this is
 * the look Spline produces (soft studio key, warm rim, glossy dielectric
 * surfaces) with no hand-written shaders, so there is no precision-qualifier or
 * link-failure surface.
 *
 * Deliberately NOT using drei's <Environment preset="studio" />: it fetches a
 * multi-megabyte HDR at runtime and allocates a PMREM cubemap, which is a real
 * failure and cost risk (it was observed losing the WebGL context outright on
 * software rasterisers, killing the canvas after ~80 draws). Three directional
 * lights and an ambient reproduce the same read for free, offline, everywhere.
 *
 * Economy: the parent stage unmounts the whole canvas when it scrolls
 * off-screen, so nothing renders when it is not being looked at.
 */
export default function Canvas3D({
  children,
  interactive = false,
}: {
  children: ReactNode;
  /**
   * Decorative stages keep pointerEvents:none so they never intercept
   * scrolling or selection. The hero model stage opts in to real pointer
   * events for drag-to-rotate; touchAction stays pan-y so vertical scroll
   * still works over the canvas on touch devices.
   */
  interactive?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
      camera={{ fov: 38, position: [0, 0, 6.4], near: 0.1, far: 40 }}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: interactive ? 'auto' : 'none',
        touchAction: interactive ? 'pan-y' : undefined,
      }}
    >
      {/* Warm studio key + cool fill + rim: the Spline lighting recipe. */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={2.8} color="#ffd7b0" />
      <directionalLight position={[-4, -2, -3]} intensity={1.2} color="#d98aa0" />
      <directionalLight position={[0, 3, -4]} intensity={1.4} color="#ff8a5b" />
      <pointLight position={[0, 1.5, 3]} intensity={12} color="#ff8a5b" distance={9} />
      {children}
    </Canvas>
  );
}

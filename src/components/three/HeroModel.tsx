import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Center,
  ContactShadows,
  Float,
  PresentationControls,
  useGLTF,
} from '@react-three/drei';
import type { Group } from 'three';

/**
 * HERO MODEL — the scanned specimen, in your hands.
 *
 * A real photogrammetry-style GLB the viewer can grab and spin. The pipeline
 * matters as much as the render: the source export was 73 MB (2M triangles,
 * 4096² PNG). It ships here at ~250 KB — meshopt-compressed geometry
 * (11.7k triangles, quantized attributes) with the base colour re-encoded as
 * a 2048² WebP. drei's useGLTF decodes EXT_meshopt_compression out of the box.
 *
 * Interaction is layered, outermost first:
 *   PresentationControls — pointer drag with spring physics; azimuth is
 *     unlimited so it can be flung, polar is clamped so it never shows its
 *     underside. `global` makes the whole panel a drag surface, and `snap`
 *     springs the figure back to its front-facing rest pose after release.
 *   Float — a slow breathing drift so the object never sits dead still.
 *   sway group — a gentle idle turn of a few degrees, a settle rather than a
 *     spin, so the figure stays facing the viewer between interactions.
 */

const MODEL_URL = '/models/hero.glb';

function Model() {
  const { scene } = useGLTF(MODEL_URL);
  const sway = useRef<Group>(null);

  useFrame((state) => {
    if (sway.current) {
      sway.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
    }
  });

  return (
    <group ref={sway}>
      <Center>
        {/* dispose={null}: the stage unmounts on scroll-away and useGLTF
            shares one cached scene, so its resources must survive unmounts. */}
        <primitive object={scene} scale={3.1} dispose={null} />
      </Center>
    </group>
  );
}

export default function HeroModel() {
  return (
    <Suspense fallback={null}>
      <PresentationControls
        global
        cursor
        speed={1.6}
        rotation={[0.06, -0.3, 0]}
        polar={[-0.45, 0.35]}
        azimuth={[-Infinity, Infinity]}
        damping={0.18}
        snap={0.55}
      >
        <Float speed={1.6} rotationIntensity={0.18} floatIntensity={0.4} floatingRange={[-0.06, 0.06]}>
          <Model />
        </Float>
      </PresentationControls>

      {/* Grounding: a soft blob shadow so the object reads as present, not pasted. */}
      <ContactShadows
        position={[0, -1.9, 0]}
        opacity={0.45}
        scale={7}
        blur={2.6}
        far={3.4}
        color="#1a0c06"
      />
    </Suspense>
  );
}

useGLTF.preload(MODEL_URL);

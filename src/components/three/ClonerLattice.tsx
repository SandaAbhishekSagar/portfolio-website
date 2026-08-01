import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CLONER LATTICE — the hero object.
 *
 * 400 clones (20×20) in an ordered grid. Each clone's height plots an
 * amplitude-modulated SINE SUM — a carrier plus two harmonics under a slow
 * modulating envelope. That is literally the shape of the signal a voice
 * pipeline ingests, so the object argues for the specialty instead of
 * decorating around it.
 *
 *   carrier   sin(x·5.0 − t·1.6)        the fundamental
 *   harmonic  sin(x·9.4 − t·2.3)·0.45   timbre
 *   harmonic  sin(x·2.1 + t·0.9)·0.30   body
 *   envelope  AM across z, so the grid reads as a waveform over time
 *
 * The cursor PRESSES INTO the surface: a gaussian well, not a bump, so the
 * sheet deforms downward under the pointer like a struck membrane.
 *
 * Colour is driven by HEIGHT, ember → amber, with latent pink blended in at
 * the press point. Per-instance colour is rewritten every frame via
 * setColorAt, which is what makes the height gradient legible as data.
 *
 * No custom GLSL: standard lit materials only, so there is no shader-link
 * failure surface. 400 instances × (setMatrixAt + setColorAt) is trivial work.
 */

const SIDE = 20;
const COUNT = SIDE * SIDE; // 400 clones, exactly
const SPACING = 0.22;
const HALF = (SIDE - 1) / 2;

export default function ClonerLattice() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const EMBER = useMemo(() => new THREE.Color('#ff8a5b'), []);
  const AMBER = useMemo(() => new THREE.Color('#f0a93c'), []);
  const LATENT = useMemo(() => new THREE.Color('#d98aa0'), []);
  const tint = useMemo(() => new THREE.Color(), []);

  const { gl } = useThree();

  // setColorAt requires an allocated instanceColor buffer; three only creates
  // it lazily in some versions. Allocate explicitly so the first frame is safe.
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    if (!m.instanceColor) {
      m.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(COUNT * 3).fill(1),
        3
      );
    }
  }, []);

  /**
   * The canvas is pointerEvents:none so it never intercepts scrolling or text
   * selection — which also means R3F's own pointer state stays at zero. Track
   * the cursor on the window instead and convert into the canvas's local
   * normalised space. Without this the press interaction silently does nothing.
   */
  const target = useRef(new THREE.Vector2(0, 0));
  const eased = useRef(new THREE.Vector2(0, 0));
  const press = useRef(0);
  const pressTarget = useRef(0);

  useEffect(() => {
    const el = gl.domElement;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      const inside = nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1;
      pressTarget.current = inside ? 1 : 0;
      if (inside) {
        target.current.set(nx * HALF * SPACING, ny * HALF * SPACING);
      }
    };

    const onLeave = () => {
      pressTarget.current = 0;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;

    const d = Math.min(delta, 0.05);
    eased.current.x += (target.current.x - eased.current.x) * Math.min(1, d * 5);
    eased.current.y += (target.current.y - eased.current.y) * Math.min(1, d * 5);
    press.current += (pressTarget.current - press.current) * Math.min(1, d * 4);

    const t = state.clock.elapsedTime;
    const px = eased.current.x;
    const pz = eased.current.y;
    let i = 0;

    for (let gx = 0; gx < SIDE; gx++) {
      const x = (gx - HALF) * SPACING;

      // amplitude-modulated sine sum — the ingested signal
      const carrier = Math.sin(x * 5.0 - t * 1.6);
      const h2 = Math.sin(x * 9.4 - t * 2.3) * 0.45;
      const h3 = Math.sin(x * 2.1 + t * 0.9) * 0.3;
      const sum = carrier + h2 + h3;

      for (let gz = 0; gz < SIDE; gz++) {
        const z = (gz - HALF) * SPACING;

        const envelope = 0.5 + 0.5 * Math.sin(z * 2.0 + t * 0.7);
        let h = sum * envelope * 0.42;

        // the cursor presses INTO the surface — a well, not a spike
        const dist = Math.hypot(x - px, z - pz);
        const well = Math.exp(-dist * dist * 7.0);
        h -= well * 0.5 * press.current;

        const height = 0.05 + Math.abs(h) * 0.62;

        dummy.position.set(x, height / 2 - 0.22, z);
        dummy.scale.set(0.11, height, 0.11);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);

        // colour by HEIGHT: ember low → amber tall, latent at the press point
        const norm = Math.min(1, Math.abs(h) / 0.72);
        tint.copy(EMBER).lerp(AMBER, norm);
        const near = well * press.current;
        if (near > 0.004) tint.lerp(LATENT, Math.min(0.92, near * 1.15));
        m.setColorAt(i, tint);

        i++;
      }
    }

    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;

    // a slow settle, never a spin — the object reads as an instrument at rest
    m.rotation.y = Math.sin(t * 0.1) * 0.18;
  });

  return (
    <group rotation={[0.6, 0.5, 0]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          roughness={0.32}
          metalness={0.14}
          emissive="#ff8a5b"
          emissiveIntensity={0.12}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}

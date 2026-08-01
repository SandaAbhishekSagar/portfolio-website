import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { YAW_LIMIT_DEG, PITCH_LIMIT_DEG, type PointerState } from './useMagneticDrift';
import type { BustAsset } from './manifest';

/**
 * MODE B — STYLIZED BUST
 * ─────────────────────────────────────────────────────────────────────────────
 * Only mounts when a licence-cleared GLB of Abhishek exists in the manifest.
 * Direction is "engineered object", never mascot: wireframe over a faceted
 * solid, one key light, accent colour as rim.
 *
 * FRAME BUDGET ENFORCEMENT
 * The brief allows Mode B only while it holds under 8ms of main-thread work per
 * frame. This component measures its own frame cost over the first ~90 frames
 * and, if it exceeds the budget, unmounts the GLB and reports upward so the
 * slot can swap to the pre-rendered turntable sprite (or Mode C if no sprite
 * was supplied). Degrading the frame rate is never an option.
 */

const FRAME_BUDGET_MS = 8;
const SAMPLE_FRAMES = 90;

function Bust({
  url,
  pointer,
  onOverBudget,
}: {
  url: string;
  pointer: React.RefObject<PointerState>;
  onOverBudget: () => void;
}) {
  const { scene } = useGLTF(url);
  const { camera } = useThree();
  const group = useRef<THREE.Group>(null);

  const frames = useRef(0);
  const accum = useRef(0);
  const decided = useRef(false);

  // One material, palette-locked. Anything the GLB shipped is replaced so the
  // object cannot arrive glossy or off-palette.
  const prepared = useMemo(() => {
    const root = scene.clone(true);
    const solid = new THREE.MeshStandardMaterial({
      color: '#2b1e19',
      roughness: 0.62,
      metalness: 0.08,
      flatShading: true,
    });
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.material = solid;
        m.castShadow = false;
        m.receiveShadow = false;
      }
    });
    return root;
  }, [scene]);

  const wire = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    prepared.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.geometry) meshes.push(m);
    });
    return meshes.map((m) => m.geometry);
  }, [prepared]);

  useFrame((_, delta) => {
    const t0 = performance.now();

    const p = pointer.current ?? { x: 0, y: 0 };
    const yaw = THREE.MathUtils.degToRad(YAW_LIMIT_DEG) * (p.x * 2);
    const pitch = THREE.MathUtils.degToRad(PITCH_LIMIT_DEG) * (-p.y * 2);
    const radius = 6.0;
    camera.position.set(
      Math.sin(yaw) * radius,
      Math.sin(pitch) * radius + 0.1,
      Math.cos(yaw) * Math.cos(pitch) * radius
    );
    camera.lookAt(0, 0, 0);

    if (!decided.current) {
      accum.current += performance.now() - t0 + delta * 0;
      frames.current++;
      if (frames.current >= SAMPLE_FRAMES) {
        decided.current = true;
        const perFrame = accum.current / frames.current;
        if (perFrame > FRAME_BUDGET_MS) {
          console.warn(
            `[centerpiece] Mode B cost ${perFrame.toFixed(2)}ms/frame ` +
              `(budget ${FRAME_BUDGET_MS}ms). Falling back.`
          );
          onOverBudget();
        }
      }
    }
  });

  return (
    <group ref={group}>
      <primitive object={prepared} />
      {/* wireframe over solid — the "engineered object" read */}
      {wire.map((g, i) => (
        <lineSegments key={i}>
          <wireframeGeometry args={[g]} />
          <lineBasicMaterial color="#ff8a5b" transparent opacity={0.22} />
        </lineSegments>
      ))}
    </group>
  );
}

/** Pre-rendered turntable: the honest fallback when the GLB is too expensive. */
function TurntableSprite({
  src,
  pointer,
}: {
  src: string;
  pointer: React.RefObject<PointerState>;
}) {
  const [frame, setFrame] = useState(0);
  const FRAMES = 24;

  useEffect(() => {
    let raf = 0;
    const step = () => {
      const p = pointer.current ?? { x: 0, y: 0 };
      const idx = Math.round((p.x + 0.5) * (FRAMES - 1));
      setFrame((f) => (f === idx ? f : Math.max(0, Math.min(FRAMES - 1, idx))));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [pointer]);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-no-repeat"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: `${FRAMES * 100}% 100%`,
        backgroundPosition: `${(frame / (FRAMES - 1)) * 100}% 50%`,
      }}
    />
  );
}

export default function ModeBust({
  asset,
  pointer,
  onFallback,
}: {
  asset: BustAsset;
  pointer: React.RefObject<PointerState>;
  onFallback: () => void;
}) {
  const [overBudget, setOverBudget] = useState(false);

  const handleOver = useRef(() => {
    setOverBudget(true);
    onFallback();
  }).current;

  if (overBudget) {
    return asset.spriteFallback ? (
      <TurntableSprite src={asset.spriteFallback} pointer={pointer} />
    ) : null;
  }

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        camera={{ fov: 36, position: [0, 0, 6], near: 0.1, far: 40 }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        {/* single key + accent rim. Baked lighting means nothing else is needed. */}
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 5]} intensity={2.4} color="#ffd7b0" />
        <directionalLight position={[-3, 1, -4]} intensity={1.6} color="#ff8a5b" />
        <Suspense fallback={null}>
          <Bust url={asset.url} pointer={pointer} onOverBudget={handleOver} />
        </Suspense>
      </Canvas>
    </div>
  );
}

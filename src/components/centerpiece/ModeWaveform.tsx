import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { YAW_LIMIT_DEG, PITCH_LIMIT_DEG, type PointerState } from './useMagneticDrift';

/**
 * MODE C — PROCEDURAL WAVEFORM (the default until a real asset of Abhishek exists)
 * ─────────────────────────────────────────────────────────────────────────────
 * A waveform rotated to three-quarter view on the same cursor-parallax rig.
 * Thematically the strongest of the three: a voice engineer's page centred on a
 * voice, and it ships today with zero asset licensing risk and zero bytes.
 *
 * Built from instanced boxes — one draw call, standard lit material, no custom
 * GLSL, so there is no shader-link surface. 88 bars, each height driven by an
 * amplitude-modulated sine sum evaluated on the CPU once per frame (88 sin
 * calls per frame is far below the 8ms budget).
 */

const BARS = 88;

function Waveform({ pointer }: { pointer: React.RefObject<PointerState> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  // Per-instance colour: ember at the troughs through amber at the peaks.
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < BARS; i++) {
      const t = i / (BARS - 1);
      color.set('#ff8a5b').lerp(new THREE.Color('#f0a93c'), t);
      m.setColorAt(i, color);
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [color]);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < BARS; i++) {
      const x = (i / (BARS - 1) - 0.5) * 7.4;
      const env = 0.35 + 0.65 * Math.exp(-Math.abs(x) / 3.1);
      const sum =
        Math.sin(x * 1.5 + t * 1.15) * 0.9 +
        Math.sin(x * 3.4 - t * 0.8) * 0.4 +
        Math.sin(x * 0.7 + t * 0.45) * 0.28;
      const h = Math.max(0.06, Math.abs(sum) * env * 1.5);

      dummy.position.set(x, 0, 0);
      dummy.scale.set(0.055, h, 0.055);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;

    // Three-quarter view, leaning by the capped yaw/pitch budget.
    const p = pointer.current ?? { x: 0, y: 0 };
    const baseYaw = THREE.MathUtils.degToRad(34);
    const basePitch = THREE.MathUtils.degToRad(15);
    const yaw = baseYaw + THREE.MathUtils.degToRad(YAW_LIMIT_DEG) * (p.x * 2);
    const pitch = basePitch + THREE.MathUtils.degToRad(PITCH_LIMIT_DEG) * (-p.y * 2);
    const radius = 7.2;
    camera.position.set(
      Math.sin(yaw) * Math.cos(pitch) * radius,
      Math.sin(pitch) * radius,
      Math.cos(yaw) * Math.cos(pitch) * radius
    );
    camera.lookAt(0, 0, 0);
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, BARS]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.34} metalness={0.15} toneMapped={false} />
    </instancedMesh>
  );
}

export default function ModeWaveform({
  pointer,
}: {
  pointer: React.RefObject<PointerState>;
}) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        camera={{ fov: 38, position: [4, 2, 6], near: 0.1, far: 40 }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 4, 5]} intensity={2.6} color="#ffd7b0" />
        <directionalLight position={[-4, -1, -3]} intensity={1.1} color="#d98aa0" />
        <pointLight position={[0, 1.5, 3]} intensity={9} color="#ff8a5b" distance={10} />
        <Waveform pointer={pointer} />
      </Canvas>
    </div>
  );
}

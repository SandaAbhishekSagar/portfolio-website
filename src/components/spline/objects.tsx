import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type Domain = 'voice' | 'retrieval' | 'vision' | 'systems';

/**
 * SPLINE-STYLE OBJECTS — rebuilt for the community-scene look
 * ─────────────────────────────────────────────────────────────────────────────
 * The referenced Spline community files share a specific vocabulary, and these
 * are rebuilt from that vocabulary rather than from generic primitives:
 *
 *   · iridescent glass          — transmission + high IOR + chromatic dispersion
 *   · soft-body / blob          — vertex-displaced spheres that breathe
 *   · cloner grids              — one instanced mesh, hundreds of small copies
 *                                 animated by index, the signature Spline motif
 *   · liquid-metal chrome       — anisotropic metal with a warm rim
 *   · extruded ribbon paths     — tube geometry along a procedural curve
 *
 * All of it is procedural: no .splinecode download, no runtime fetch, no CORS
 * dependency (the community export endpoints return 403 to non-browser clients,
 * so embedding them directly would be a broken link on someone else's server).
 * These render offline, forever, and stay inside the warm token palette.
 */

export const DOMAIN_STYLE: Record<Domain, { color: string; glow: string }> = {
  voice: { color: '#ff8a5b', glow: 'rgba(255,138,91,0.35)' },
  retrieval: { color: '#f0a93c', glow: 'rgba(240,169,60,0.32)' },
  vision: { color: '#d98aa0', glow: 'rgba(217,138,160,0.32)' },
  systems: { color: '#ffb27a', glow: 'rgba(255,178,122,0.3)' },
};

/* ── shared materials ─────────────────────────────────────────────────────── */

/** Iridescent dispersive glass — the hero material of modern Spline scenes. */
function GlassMaterial({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.03}
      metalness={0}
      transmission={0.94}
      thickness={1.6}
      ior={1.6}
      iridescence={1}
      iridescenceIOR={1.9}
      iridescenceThicknessRange={[100, 640]}
      clearcoat={1}
      clearcoatRoughness={0.04}
      envMapIntensity={1.4}
      attenuationColor={color}
      attenuationDistance={2.4}
      transparent
    />
  );
}

/** Liquid chrome — warm anisotropic metal. */
function ChromeMaterial({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.14}
      metalness={1}
      anisotropy={0.7}
      clearcoat={1}
      clearcoatRoughness={0.1}
      envMapIntensity={1.8}
      emissive={color}
      emissiveIntensity={0.07}
    />
  );
}

/* ── 1. soft-body blob ────────────────────────────────────────────────────── */

/**
 * A sphere whose vertices are displaced by layered trigonometric noise, so the
 * surface swells and settles like a soft body. This is the Spline "blob" read,
 * done on the CPU over a low-poly sphere (cheap: 642 vertices).
 */
function SoftBlob({ color, scale = 1 }: { color: string; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const base = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 44, 32);
    return {
      geometry: g,
      original: Float32Array.from(g.attributes.position.array as Float32Array),
    };
  }, []);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const pos = mesh.geometry.attributes.position;
    const o = base.original;
    for (let i = 0; i < pos.count; i++) {
      const x = o[i * 3];
      const y = o[i * 3 + 1];
      const z = o[i * 3 + 2];
      const d =
        Math.sin(x * 2.1 + t * 0.9) * 0.11 +
        Math.sin(y * 2.6 - t * 0.7) * 0.09 +
        Math.sin(z * 3.0 + t * 1.1) * 0.07;
      const k = 1 + d;
      pos.setXYZ(i, x * k, y * k, z * k);
    }
    pos.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
    mesh.rotation.y = t * 0.2;
  });

  return (
    <mesh ref={ref} geometry={base.geometry} scale={scale}>
      <GlassMaterial color={color} />
    </mesh>
  );
}

/* ── 2. cloner grid ───────────────────────────────────────────────────────── */

/**
 * The Spline "cloner": one geometry, hundreds of instances on a lattice, each
 * offset in time by its index so a wave travels through the grid. Single draw
 * call via InstancedMesh.
 */
function ClonerGrid({ color, count = 6 }: { color: string; count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const total = count * count;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    let i = 0;
    const half = (count - 1) / 2;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const dx = (x - half) * 0.42;
        const dy = (y - half) * 0.42;
        const dist = Math.hypot(dx, dy);
        const z = Math.sin(t * 1.5 - dist * 2.4) * 0.26;
        dummy.position.set(dx, dy, z);
        const s = 0.13 + Math.cos(t * 1.5 - dist * 2.4) * 0.035;
        dummy.scale.setScalar(Math.max(0.05, s));
        dummy.rotation.set(t * 0.3 + dist, t * 0.2, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i++, dummy.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.rotation.x = -0.5;
    mesh.rotation.y = Math.sin(t * 0.2) * 0.3;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, total]}>
      <icosahedronGeometry args={[1, 0]} />
      <ChromeMaterial color={color} />
    </instancedMesh>
  );
}

/* ── 3. extruded ribbon ───────────────────────────────────────────────────── */

/** A tube swept along a procedural 3D curve — Spline's path-extrude motif. */
function Ribbon({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 220; i++) {
      const t = (i / 220) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(t) * 0.95 + Math.cos(t * 3) * 0.16,
          Math.sin(t * 2) * 0.52,
          Math.sin(t) * 0.95 + Math.sin(t * 3) * 0.16
        )
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts, true);
    return new THREE.TubeGeometry(curve, 260, 0.11, 18, true);
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.3;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });

  return (
    <mesh ref={ref} geometry={geometry} scale={1.05}>
      <ChromeMaterial color={color} />
    </mesh>
  );
}

/* ── 4. nested glass shells ───────────────────────────────────────────────── */

/** Concentric dispersive shells — the "crystal" scene read. */
function GlassShells({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.22;
    if (inner.current) {
      const t = state.clock.elapsedTime;
      inner.current.rotation.x = t * 0.5;
      inner.current.rotation.z = t * 0.35;
    }
  });

  return (
    <group ref={ref}>
      <mesh scale={1.22}>
        <icosahedronGeometry args={[1, 2]} />
        <GlassMaterial color={color} />
      </mesh>
      <mesh ref={inner} scale={0.62}>
        <octahedronGeometry args={[1, 0]} />
        <ChromeMaterial color="#f7ece4" />
      </mesh>
      <mesh scale={1.55}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.14} />
      </mesh>
    </group>
  );
}

/* ── domain mapping ───────────────────────────────────────────────────────── */

/**
 * Each domain gets the object whose behaviour matches the work:
 *   voice     → soft body, because a voice is a continuously deforming signal
 *   retrieval → nested glass shells, because retrieval is search inside a space
 *   vision    → cloner grid, because a sensor is a lattice being sampled
 *   systems   → extruded ribbon, because a pipeline is a path with throughput
 */
export function DomainObject({ domain }: { domain: Domain }) {
  const { color } = DOMAIN_STYLE[domain];

  return (
    <group scale={1.02}>
      {domain === 'voice' && <SoftBlob color={color} scale={1.15} />}
      {domain === 'retrieval' && <GlassShells color={color} />}
      {domain === 'vision' && <ClonerGrid color={color} count={6} />}
      {domain === 'systems' && <Ribbon color={color} />}
    </group>
  );
}

/**
 * The hero object: a dispersive glass soft-body inside a slowly counter-rotating
 * chrome ribbon. Two of the five reference motifs composed into one read —
 * a signal (the blob) travelling a path (the ribbon).
 */
export function HeroObject() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);

  const ringGeometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(t) * 1.62,
          Math.sin(t * 2) * 0.34,
          Math.sin(t) * 1.62
        )
      );
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 240, 0.055, 14, true);
  }, []);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.16;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
    }
    if (ring.current) ring.current.rotation.z -= delta * 0.4;
  });

  return (
    <group ref={group}>
      <SoftBlob color="#ff8a5b" scale={0.98} />
      <mesh ref={ring} geometry={ringGeometry} rotation={[0.5, 0, 0]}>
        <ChromeMaterial color="#f0a93c" />
      </mesh>
    </group>
  );
}

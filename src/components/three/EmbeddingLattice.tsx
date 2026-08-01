import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * EMBEDDING LATTICE — the retrieval instrument.
 *
 * The same argument as the hero lattice, made about a different stage of the
 * pipeline. 400 clones again, but arranged as four domain clusters in a
 * projected embedding space rather than a grid: voice, retrieval, vision,
 * systems. Cluster membership is fixed and deterministic.
 *
 * The cursor is the QUERY. Whichever cluster it approaches is retrieved: those
 * clones rise and shift toward amber, the rest settle low and stay ember. That
 * is a nearest-neighbour lookup rendered as geometry — exactly what the section
 * beside it does in software.
 *
 * Standard lit materials only, no custom GLSL.
 */

const COUNT = 400;
const PER = COUNT / 4;

type Node = { x: number; z: number; cluster: number; seed: number };

function buildNodes(): Node[] {
  // deterministic LCG so the space is identical on every visit
  let s = 90210;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  const centers = [
    [-1.05, -0.85],
    [1.1, -0.7],
    [-0.95, 0.95],
    [1.0, 1.05],
  ];

  const nodes: Node[] = [];
  for (let c = 0; c < 4; c++) {
    for (let i = 0; i < PER; i++) {
      // summed uniforms ≈ gaussian, so clusters have soft edges
      const gx = (rnd() + rnd() + rnd() - 1.5) * 0.62;
      const gz = (rnd() + rnd() + rnd() - 1.5) * 0.62;
      nodes.push({
        x: centers[c][0] + gx,
        z: centers[c][1] + gz,
        cluster: c,
        seed: rnd(),
      });
    }
  }
  return nodes;
}

export default function EmbeddingLattice() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const nodes = useMemo(buildNodes, []);

  const EMBER = useMemo(() => new THREE.Color('#ff8a5b'), []);
  const AMBER = useMemo(() => new THREE.Color('#f0a93c'), []);
  const LATENT = useMemo(() => new THREE.Color('#d98aa0'), []);
  const tint = useMemo(() => new THREE.Color(), []);

  const { gl } = useThree();
  const target = useRef(new THREE.Vector2(0, 0));
  const eased = useRef(new THREE.Vector2(0, 0));
  const active = useRef(0);
  const activeTarget = useRef(0);

  useEffect(() => {
    const m = mesh.current;
    if (m && !m.instanceColor) {
      m.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(COUNT * 3).fill(1),
        3
      );
    }
  }, []);

  // The canvas is pointerEvents:none, so track the cursor on the window and
  // map it into the stage's local space.
  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      const inside = nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1;
      activeTarget.current = inside ? 1 : 0;
      if (inside) target.current.set(nx * 1.9, ny * 1.9);
    };
    const onLeave = () => {
      activeTarget.current = 0;
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
    active.current += (activeTarget.current - active.current) * Math.min(1, d * 4);

    const t = state.clock.elapsedTime;
    const qx = eased.current.x;
    const qz = eased.current.y;

    // which cluster is nearest the query — the retrieved one
    const centers = [
      [-1.05, -0.85],
      [1.1, -0.7],
      [-0.95, 0.95],
      [1.0, 1.05],
    ];
    let best = -1;
    let bestD = Infinity;
    for (let c = 0; c < 4; c++) {
      const dd = Math.hypot(centers[c][0] - qx, centers[c][1] - qz);
      if (dd < bestD) {
        bestD = dd;
        best = c;
      }
    }

    for (let i = 0; i < COUNT; i++) {
      const n = nodes[i];

      const idle = 0.1 + 0.045 * Math.sin(t * 0.9 + n.seed * 12.0);
      const retrieved = n.cluster === best ? active.current : 0;

      // proximity within the retrieved cluster — nearer nodes rise further
      const dist = Math.hypot(n.x - qx, n.z - qz);
      const prox = Math.exp(-dist * dist * 0.9);

      const height = idle + retrieved * prox * 0.72;
      const y = height / 2 - 0.16;

      dummy.position.set(n.x, y, n.z);
      dummy.scale.set(0.085, Math.max(0.05, height), 0.085);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);

      // ember at rest → amber when retrieved, latent at the query point
      const lift = Math.min(1, retrieved * prox * 1.5);
      tint.copy(EMBER).lerp(AMBER, lift);
      if (retrieved > 0.02 && prox > 0.55) {
        tint.lerp(LATENT, Math.min(0.85, (prox - 0.55) * 1.9 * retrieved));
      }
      // unretrieved clusters recede
      if (best >= 0 && n.cluster !== best && active.current > 0.02) {
        tint.multiplyScalar(1 - 0.5 * active.current);
      }
      m.setColorAt(i, tint);
    }

    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.rotation.y = Math.sin(t * 0.09) * 0.16;
  });

  return (
    <group rotation={[0.66, 0.42, 0]} scale={1.18}>
      <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          roughness={0.34}
          metalness={0.12}
          emissive="#ff8a5b"
          emissiveIntensity={0.1}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}

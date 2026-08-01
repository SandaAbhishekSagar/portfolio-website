import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { YAW_LIMIT_DEG, PITCH_LIMIT_DEG, type PointerState } from './useMagneticDrift';
import type { PortraitAsset } from './manifest';

/**
 * MODE A — DEPTH-DISPLACED PORTRAIT
 * ─────────────────────────────────────────────────────────────────────────────
 * A real photograph on a subdivided plane, displaced along Z by a grayscale
 * depth map, so moving the cursor produces genuine parallax between the subject
 * and what is behind him. One draw call, two textures, no geometry beyond a
 * PlaneGeometry.
 *
 * WHY THE EDGE WORK DOMINATES THIS FILE
 * Naive depth displacement tears at the silhouette: adjacent vertices land on
 * opposite sides of a depth cliff and the triangles between them stretch into
 * visible spikes. Three defences, all in the shaders:
 *
 *   1. GRADIENT CLAMP (vertex). Sample depth at four neighbours and measure the
 *      local gradient. Where the gradient is steep — a silhouette edge — scale
 *      displacement toward zero. The surface stays welded instead of spiking.
 *   2. SMOOTHED DEPTH (vertex). Displace by a 5-tap average rather than the raw
 *      texel, so single-pixel depth noise cannot throw a vertex.
 *   3. BOUNDARY FEATHER (fragment). Alpha falls off across the same gradient,
 *      so any residual stretched geometry fades instead of showing as a hard
 *      shard, and the plate blends into the panel rather than ending on a line.
 *
 * Depth of field: background pixels (low depth) receive a slight desaturation
 * and lift toward the void colour, which reads as aerial perspective. Combined
 * with the parallax it separates subject from ground without a blur pass.
 */

const VERT = /* glsl */ `
  uniform sampler2D uDepth;
  uniform vec2 uTexel;
  uniform float uAmount;
  uniform float uEdgeClamp;

  varying vec2 vUv;
  varying float vDepth;
  varying float vEdge;

  float depthAt(vec2 uv) {
    return texture2D(uDepth, uv).r;
  }

  void main() {
    vUv = uv;

    // 5-tap smoothed depth — kills single-texel noise before it moves a vertex
    float c = depthAt(uv);
    float l = depthAt(uv - vec2(uTexel.x, 0.0));
    float r = depthAt(uv + vec2(uTexel.x, 0.0));
    float d = depthAt(uv - vec2(0.0, uTexel.y));
    float u = depthAt(uv + vec2(0.0, uTexel.y));
    float smoothed = (c * 2.0 + l + r + d + u) / 6.0;

    // local gradient magnitude — large at a silhouette
    float gx = abs(r - l);
    float gy = abs(u - d);
    float grad = clamp((gx + gy) * uEdgeClamp, 0.0, 1.0);

    // clamp displacement where the gradient is steep, so the mesh never tears
    float weld = 1.0 - smoothstep(0.15, 0.75, grad);

    vDepth = smoothed;
    vEdge = grad;

    vec3 p = position;
    p.z += (smoothed - 0.5) * uAmount * weld;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uColor;
  uniform vec3 uVoid;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vDepth;
  varying float vEdge;

  void main() {
    vec4 tex = texture2D(uColor, vUv);

    // depth-of-field falloff: far pixels desaturate and sink toward the panel
    // colour, so the background softens as it displaces away from the subject
    float far = 1.0 - clamp(vDepth, 0.0, 1.0);
    float grey = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 col = mix(tex.rgb, vec3(grey), far * 0.45);
    col = mix(col, uVoid, far * 0.38);

    // feather the subject boundary — hides any residual stretched geometry
    float edgeFade = 1.0 - smoothstep(0.35, 0.9, vEdge);

    // vignette the plate edges so it blends into the panel, never a hard cut
    vec2 q = abs(vUv - 0.5) * 2.0;
    float frame = (1.0 - smoothstep(0.86, 1.0, q.x)) * (1.0 - smoothstep(0.86, 1.0, q.y));

    float a = tex.a * uOpacity * edgeFade * frame;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col, a);
  }
`;

function Plate({
  asset,
  pointer,
  onReady,
}: {
  asset: PortraitAsset;
  pointer: React.RefObject<PointerState>;
  onReady: () => void;
}) {
  const { camera } = useThree();
  const [maps, setMaps] = useState<{ color: THREE.Texture; depth: THREE.Texture } | null>(
    null
  );

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let cancelled = false;
    let color: THREE.Texture | null = null;
    let depth: THREE.Texture | null = null;

    const finish = () => {
      if (cancelled || !color || !depth) return;
      color.colorSpace = THREE.SRGBColorSpace;
      for (const t of [color, depth]) {
        t.minFilter = THREE.LinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.wrapS = THREE.ClampToEdgeWrapping;
        t.wrapT = THREE.ClampToEdgeWrapping;
        t.generateMipmaps = false;
      }
      setMaps({ color, depth });
      onReady();
    };

    loader.load(asset.color, (t) => { color = t; finish(); });
    loader.load(asset.depth, (t) => { depth = t; finish(); });

    return () => {
      cancelled = true;
      color?.dispose();
      depth?.dispose();
    };
  }, [asset.color, asset.depth, onReady]);

  const uniforms = useMemo(
    () => ({
      uColor: { value: null as THREE.Texture | null },
      uDepth: { value: null as THREE.Texture | null },
      uTexel: { value: new THREE.Vector2(1 / 1024, 1 / 1024) },
      uAmount: { value: 0.62 },
      uEdgeClamp: { value: 26 },
      uVoid: { value: new THREE.Color('#1e1512') },
      uOpacity: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    if (!maps) return;
    uniforms.uColor.value = maps.color;
    uniforms.uDepth.value = maps.depth;
    const img = maps.depth.image as { width?: number; height?: number } | undefined;
    if (img?.width && img?.height) {
      uniforms.uTexel.value.set(1 / img.width, 1 / img.height);
    }
  }, [maps, uniforms]);

  // Subdivided just enough to carry the displacement: 96×96 = ~18k tris, one
  // draw call. More segments buys nothing once the gradient clamp is doing the
  // silhouette work.
  const geo = useMemo(() => new THREE.PlaneGeometry(3.5, 4.4, 96, 96), []);
  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    if (maps) uniforms.uOpacity.value += (1 - uniforms.uOpacity.value) * Math.min(1, d * 3.5);

    const p = pointer.current ?? { x: 0, y: 0 };
    // Camera orbits by a capped yaw/pitch — the object never spins to face the
    // cursor, it only leans. 3° and 2° are the whole budget.
    const yaw = THREE.MathUtils.degToRad(YAW_LIMIT_DEG) * (p.x * 2);
    const pitch = THREE.MathUtils.degToRad(PITCH_LIMIT_DEG) * (-p.y * 2);
    const radius = 6.4;
    camera.position.set(
      Math.sin(yaw) * radius,
      Math.sin(pitch) * radius,
      Math.cos(yaw) * Math.cos(pitch) * radius
    );
    camera.lookAt(0, 0, 0);
  });

  if (!maps) return null;

  return (
    <mesh geometry={geo}>
      <shaderMaterial
        attach="material"
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function ModePortrait({
  asset,
  pointer,
}: {
  asset: PortraitAsset;
  pointer: React.RefObject<PointerState>;
}) {
  const [ready, setReady] = useState(false);
  const handleReady = useRef(() => setReady(true)).current;

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        camera={{ fov: 38, position: [0, 0, 6.4], near: 0.1, far: 40 }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <Plate asset={asset} pointer={pointer} onReady={handleReady} />
      </Canvas>
      {!ready && (
        <div className="absolute inset-0 animate-pulse rounded-lg bg-void-edge/40" />
      )}
    </div>
  );
}

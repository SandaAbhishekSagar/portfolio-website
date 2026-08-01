/**
 * CENTERPIECE ASSET MANIFEST
 * ─────────────────────────────────────────────────────────────────────────────
 * The single place that declares which real assets exist. Nothing else in the
 * centerpiece code hardcodes a path.
 *
 * ASSET OWNERSHIP RULES (enforced, not advisory):
 *   - No third-party demo assets. The motionsites/figma 3D character is a
 *     licensed demo asset and is never used, copied, hotlinked or re-rendered.
 *   - No stock avatars, no generated faces, no likeness of anyone but Abhishek.
 *   - Until a real, licence-cleared asset of Abhishek exists, these stay null
 *     and the centerpiece resolves to MODE C (procedural), which is the
 *     thematically strongest option anyway.
 *
 * TO SHIP MODE A — depth-displaced portrait:
 *   1. Drop a real photograph of Abhishek at public/centerpiece/portrait.avif
 *      (1024px wide, AVIF, target < 150KB)
 *   2. Drop its grayscale depth map at public/centerpiece/portrait-depth.png
 *      (same aspect, near = white, far = black, target < 60KB)
 *   3. Set `portrait` below to that pair and fill in `alt`.
 *   4. `npm run build` — scripts/check-centerpiece.mjs verifies both files
 *      exist, are within budget, and that no placeholder reached dist.
 *
 * TO SHIP MODE B — stylized bust:
 *   1. Confirm the licence in WRITING permits commercial use on a personal site
 *      and that the likeness is Abhishek's.
 *   2. Draco-compress to < 1.5MB, one material, baked lighting, < 30k tris,
 *      no morph targets, no hair sim.
 *   3. Drop at public/centerpiece/bust.glb and set `bust` below.
 */

export type PortraitAsset = {
  color: string;
  depth: string;
  /** Real descriptive alt text. Never "portrait" or "3D model". */
  alt: string;
  /** Bytes, for the build gate. */
  maxColorBytes: number;
  maxDepthBytes: number;
};

export type BustAsset = {
  url: string;
  alt: string;
  maxBytes: number;
  /** Pre-rendered turntable frames, used when the GLB blows the frame budget. */
  spriteFallback?: string;
};

/**
 * MODE A asset — SHIPPED.
 *
 * `portrait.avif` is an original flat-vector avatar illustration of Abhishek
 * (bitmoji/memoji style), generated for this site. It is not a photograph, not
 * a stock avatar, and not derived from any third-party demo asset, so it clears
 * the ownership rules above.
 *
 * `portrait-depth.png` is the depth map supplied by Abhishek, normalised and
 * matted to a clean silhouette (near = white, far = pure black). Both plates
 * are 4:5 and framed identically, which is what keeps the displacement
 * registered to the artwork instead of smearing across it.
 */
export const portrait: PortraitAsset | null = {
  color: '/centerpiece/portrait.avif',
  depth: '/centerpiece/portrait-depth.png',
  alt:
    'Illustrated avatar of Abhishek Sagar Sanda: a young man with short dark hair ' +
    'and rounded tortoiseshell glasses, in a cream t-shirt, lit warm from the left.',
  maxColorBytes: 150 * 1024,
  maxDepthBytes: 60 * 1024,
};

/**
 * MODE B asset. null until a commissioned or licensed GLB of Abhishek arrives
 * with written licence confirmation.
 */
export const bust: BustAsset | null = null;

/** Paths the build gate checks. Kept here so the script and app agree. */
export const EXPECTED_PATHS = {
  color: 'centerpiece/portrait.avif',
  depth: 'centerpiece/portrait-depth.png',
  bust: 'centerpiece/bust.glb',
} as const;

export const BUDGETS = {
  colorBytes: 150 * 1024,
  depthBytes: 60 * 1024,
  bustBytes: 1.5 * 1024 * 1024,
} as const;

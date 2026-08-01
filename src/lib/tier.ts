export type Tier = 'full' | 'reduced' | 'static';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function hasWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  } catch {
    return false;
  }
}

/**
 * Is this genuinely a weak device?
 *
 * Deliberately conservative: we only downgrade on *positive* evidence of a
 * weak device, never on a missing API. Earlier this function guessed, and the
 * guesses were wrong in three ways that all failed toward "reduced":
 *
 *   - it read window.innerWidth, which is the *iframe* width when the site is
 *     embedded, so any embedded desktop view was demoted;
 *   - it defaulted deviceMemory to 4 and then rejected `<= 4`, so Firefox and
 *     Safari (which do not implement deviceMemory at all) never got WebGL;
 *   - it rejected `cores <= 4`, which excludes plenty of healthy laptops.
 *
 * Now: a coarse pointer on a genuinely small *screen* is mobile. Everything
 * else with WebGL2 gets the full tier, and the runtime FPS sampler in Scene
 * handles the rest by shedding load if the device turns out to be slow.
 */
function isWeakDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency;
  const memory = nav.deviceMemory;

  // Use screen width, not innerWidth — innerWidth is the iframe, not the device.
  const screenW = Math.min(window.screen?.width ?? 1920, window.screen?.height ?? 1080);
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  // A touch device on a phone-sized screen. Tablets and touch laptops keep 3D.
  if (coarse && screenW <= 560) return true;

  // Only trust these when the browser actually reports them.
  if (typeof cores === 'number' && cores <= 2) return true;
  if (typeof memory === 'number' && memory <= 2) return true;

  return false;
}

/**
 * Three tiers, all complete:
 *   full    — WebGL2 available. The travelling 3D pipeline.
 *   reduced — phone or no WebGL2. Same stations, CSS depth, no WebGL.
 *   static  — reduced-motion. Clean 2D, nothing moves, all content present.
 *
 * Override for testing and for anyone who wants to force a tier:
 *   ?tier=full | ?tier=reduced | ?tier=static
 * The choice persists in sessionStorage so it survives in-page navigation.
 */
export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'static';

  const fromQuery = new URLSearchParams(window.location.search).get('tier');
  const stored = (() => {
    try {
      return sessionStorage.getItem('tier-override');
    } catch {
      return null;
    }
  })();
  const override = fromQuery || stored;

  if (override === 'full' || override === 'reduced' || override === 'static') {
    try {
      sessionStorage.setItem('tier-override', override);
    } catch {
      /* private mode — fine, the query param still works */
    }
    // Never hand out a tier the device cannot actually render.
    if (override === 'full' && !hasWebGL2()) return 'reduced';
    return override;
  }

  if (prefersReducedMotion()) return 'static';
  if (!hasWebGL2()) return 'reduced';
  if (isWeakDevice()) return 'reduced';
  return 'full';
}

export function setTierOverride(tier: Tier) {
  try {
    sessionStorage.setItem('tier-override', tier);
  } catch {
    /* ignore */
  }
}

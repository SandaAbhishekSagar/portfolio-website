#!/usr/bin/env node
/**
 * CENTERPIECE BUILD GATE
 * ─────────────────────────────────────────────────────────────────────────────
 * Runs after `vite build`. Enforces the asset rules so a placeholder or an
 * over-budget asset can never reach production.
 *
 * It fails the build when:
 *   1. A declared asset is missing from dist.
 *   2. A declared asset is over its byte budget.
 *   3. Any file matching a placeholder signature reached dist.
 *
 * It passes quietly, with a report, when the mounted mode declares no assets —
 * that is the Mode C path and is a legitimate ship state.
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = 'dist';
const MANIFEST = 'src/components/centerpiece/manifest.ts';
const MOUNT = 'src/sections/About.tsx';

const BUDGETS = {
  colorBytes: 150 * 1024,
  depthBytes: 60 * 1024,
  bustBytes: 1.5 * 1024 * 1024,
};

const PLACEHOLDER_SIGNATURES = [
  'PLACEHOLDER',
  'placeholder-portrait',
  'DO-NOT-SHIP',
  'sample-avatar',
  'motionsites',
];

const fail = (msg) => {
  console.error(`\n✗ centerpiece gate: ${msg}\n`);
  process.exit(1);
};

const kb = (n) => `${(n / 1024).toFixed(1)}KB`;

if (!existsSync(DIST)) fail(`no ${DIST}/ directory — run vite build first`);

const manifestSrc = readFileSync(MANIFEST, 'utf8');

// A declared asset is a non-null export in the manifest.
const portraitDeclared = /export const portrait: PortraitAsset \| null = \{/.test(manifestSrc);
const bustDeclared = /export const bust: BustAsset \| null = \{/.test(manifestSrc);

// The mode that actually SHIPS is the one the slot is mounted with, not merely
// the richest asset the manifest declares. Read the mount so the gate can never
// report a mode the visitor is not seeing.
const mountSrc = readFileSync(MOUNT, 'utf8');
const mountedMatch = mountSrc.match(
  /<CenterpieceSlot[\s\S]{0,240}?mode="(portrait|bust|waveform|auto)"/
);
const mounted = mountedMatch ? mountedMatch[1] : 'auto';

const resolved =
  mounted === 'waveform'
    ? 'C (procedural)'
    : mounted === 'portrait'
      ? portraitDeclared
        ? 'A (portrait)'
        : 'C (procedural — portrait asset absent)'
      : mounted === 'bust'
        ? bustDeclared
          ? 'B (bust)'
          : 'C (procedural — bust asset absent)'
        : portraitDeclared
          ? 'A (portrait)'
          : bustDeclared
            ? 'B (bust)'
            : 'C (procedural)';

const shipsAssets = resolved.startsWith('A') || resolved.startsWith('B');

const report = [];

// ── 1 + 2. declared assets must exist in dist and fit their budget ──────────
function checkAsset(label, relPath, budget) {
  const p = join(DIST, relPath);
  if (!existsSync(p)) {
    fail(`${label} is declared in the manifest but ${relPath} is not in dist/`);
  }
  const bytes = statSync(p).size;
  if (bytes > budget) {
    fail(
      `${label} is ${kb(bytes)}, over its ${kb(budget)} budget. ` +
        `Re-encode or reject it — do not ship an oversized asset.`
    );
  }
  report.push(`  ${label.padEnd(22)} ${kb(bytes).padStart(9)}  (budget ${kb(budget)})`);
}

if (portraitDeclared) {
  checkAsset('MODE A colour plate', 'centerpiece/portrait.avif', BUDGETS.colorBytes);
  checkAsset('MODE A depth map', 'centerpiece/portrait-depth.png', BUDGETS.depthBytes);
}
if (bustDeclared) {
  checkAsset('MODE B bust GLB', 'centerpiece/bust.glb', BUDGETS.bustBytes);
}

// ── 3. no placeholder may reach dist ────────────────────────────────────────
function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const distFiles = walk(DIST);

for (const f of distFiles) {
  const base = f.split('/').pop();
  for (const sig of PLACEHOLDER_SIGNATURES) {
    if (base.toLowerCase().includes(sig.toLowerCase())) {
      fail(`placeholder asset reached dist: ${f} (matched "${sig}")`);
    }
  }
}

// Scan text assets for placeholder markers left in code or markup.
const TEXTUAL = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt']);
for (const f of distFiles) {
  if (!TEXTUAL.has(extname(f))) continue;
  const body = readFileSync(f, 'utf8');
  for (const sig of PLACEHOLDER_SIGNATURES) {
    if (body.includes(sig)) {
      fail(`placeholder marker "${sig}" found inside ${f}`);
    }
  }
}

// ── 4. Mode C must not pull asset bytes onto the critical path ──────────────
if (!shipsAssets) {
  const html = readFileSync(join(DIST, 'index.html'), 'utf8');
  for (const ref of ['portrait.avif', 'portrait-depth.png', 'bust.glb']) {
    if (html.includes(ref)) {
      fail(
        `mounted mode is ${resolved} but dist/index.html still references ${ref}. ` +
          `Mode C must ship zero asset weight.`
      );
    }
  }
}

// ── report ──────────────────────────────────────────────────────────────────
console.log('\n✓ centerpiece gate passed');
console.log(`  mounted mode          ${mounted}`);
console.log(`  resolved mode         ${resolved}`);
if (shipsAssets && report.length) {
  console.log(report.join('\n'));
} else {
  console.log('  Mode C ships with 0KB of asset weight (no image, no model)');
  if (report.length) {
    console.log('  declared but unused, not on the critical path:');
    console.log(report.join('\n'));
  }
}
console.log('');

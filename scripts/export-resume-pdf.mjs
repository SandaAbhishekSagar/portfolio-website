/**
 * Print-ready resume PDF from the canonical record.
 * Output: public/Abhishek-Sagar-Sanda-Resume.pdf
 */
import { chromium } from 'playwright';
import { writeFileSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import * as esbuild from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const bundlePath = resolve(root, 'scripts/.record.cjs');

await esbuild.build({
  entryPoints: [resolve(root, 'src/data/record.ts')],
  bundle: true,
  outfile: bundlePath,
  format: 'cjs',
  platform: 'node',
  target: 'node20',
});

const {
  PROFILE,
  EXPERIENCE,
  EDUCATION,
  AWARDS,
  HACKATHONS,
  PUBLICATIONS,
  PROJECTS,
  SKILLS,
  SKILL_GROUPS,
} = require(bundlePath);

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(PROFILE.name)} — Resume</title>
<style>
  @page { margin: 0.55in; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #111; font-size: 10.5pt; line-height: 1.35; margin: 0; }
  h1 { font-size: 18pt; margin: 0 0 2pt; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #333; margin: 14pt 0 6pt; padding-bottom: 2pt; }
  h3 { font-size: 10.5pt; margin: 8pt 0 0; }
  p, li { margin: 0 0 3pt; }
  ul { margin: 2pt 0 0; padding-left: 16pt; }
  .meta { font-size: 9.5pt; margin: 2pt 0 0; }
  .muted { font-style: italic; font-size: 9.5pt; }
  a { color: #111; text-decoration: none; }
</style>
</head>
<body>
  <h1>${esc(PROFILE.name)}</h1>
  <p>${esc(PROFILE.title)}</p>
  <p class="meta">
    ${esc(PROFILE.location)} ·
    <a href="mailto:${esc(PROFILE.email)}">${esc(PROFILE.email)}</a> ·
    github.com/SandaAbhishekSagar ·
    linkedin.com/in/sandaabhisheksagar
  </p>
  <p class="meta"><strong>${esc(PROFILE.availability)}</strong></p>
  <p class="meta">Interview Coach IVR: ${esc(PROFILE.ivrPhone)}</p>

  <h2>Summary</h2>
  <p>${esc(PROFILE.summary)}</p>

  <h2>Experience</h2>
  ${EXPERIENCE.map(
    (r) => `
    <h3>${esc(r.role)} — ${esc(r.org)}${r.orgNote ? ` (${esc(r.orgNote)})` : ''}</h3>
    <p class="muted">${esc(r.period)} · ${esc(r.location)}</p>
    <ul>${r.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  `
  ).join('')}

  <h2>Selected projects</h2>
  ${PROJECTS.map(
    (p) => `
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.summary)}</p>
    <p class="muted">${esc(p.stack.join(' · '))}${p.metric ? ` · ${esc(p.metric.label)}: ${esc(p.metric.value)}` : ''}</p>
  `
  ).join('')}

  <h2>Skills</h2>
  ${SKILL_GROUPS.map((g) => {
    const names = SKILLS.filter((s) => s.group === g).map((s) => s.name);
    return names.length ? `<p><strong>${esc(g)}:</strong> ${esc(names.join(', '))}</p>` : '';
  }).join('')}

  <h2>Education</h2>
  ${EDUCATION.map(
    (e) => `
    <h3>${esc(e.degree)}</h3>
    <p class="muted">${esc(e.school)}${e.location ? `, ${esc(e.location)}` : ''}${e.date ? ` · ${esc(e.date)}` : ''}${e.gpa ? ` · GPA ${esc(e.gpa)}` : ''}</p>
  `
  ).join('')}

  <h2>Awards &amp; recognition</h2>
  <ul>
    ${AWARDS.map(
      (a) =>
        `<li><strong>${esc(a.title)}</strong> — ${esc(a.org)} (${esc(a.date)})${a.placement ? `. ${esc(a.placement)}` : ''}. ${esc(a.detail)}</li>`
    ).join('')}
    ${HACKATHONS.map(
      (h) =>
        `<li><strong>${esc(h.title)}</strong> — ${esc(h.org)} (${esc(h.date)})${h.placement ? `. ${esc(h.placement)}` : ''}. ${esc(h.detail)}</li>`
    ).join('')}
  </ul>

  ${
    PUBLICATIONS?.length
      ? `<h2>Publications</h2><ul>${PUBLICATIONS.map((p) => `<li>${esc(p.title)} — ${esc(p.org)} (${esc(p.date)}). ${esc(p.detail)}</li>`).join('')}</ul>`
      : ''
  }
</body>
</html>`;

const tmpHtml = resolve(root, 'scripts/.resume-export.html');
writeFileSync(tmpHtml, html, 'utf8');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(tmpHtml).href, { waitUntil: 'load' });
const out = resolve(root, 'public/Abhishek-Sagar-Sanda-Resume.pdf');
await page.pdf({
  path: out,
  format: 'Letter',
  printBackground: true,
  margin: { top: '0.55in', right: '0.55in', bottom: '0.55in', left: '0.55in' },
});
await browser.close();

try {
  unlinkSync(tmpHtml);
  unlinkSync(bundlePath);
} catch {
  /* ignore cleanup errors */
}

console.log('Wrote', out);

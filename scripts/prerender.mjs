/**
 * PRERENDER
 * ─────────────────────────────────────────────────────────────────────────────
 * The critical fix: the previous draft shipped an empty <div id="root">, so
 * crawlers, link previews, and any JS-disabled visitor saw nothing but meta
 * tags.
 *
 * This renders the full React tree to static HTML at build time for every
 * route — the home page and one case study per project — and injects it into
 * dist/index.html plus dist/work/{slug}/index.html.
 *
 * Result: the complete professional record is in the initial HTML response.
 * React then hydrates on top of it. With JS disabled the site is still a
 * complete, readable, navigable document.
 */
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const ssrDir = path.resolve('.ssr');

const { default: StaticApp } = await import(
  pathToFileURL(path.join(ssrDir, 'static-app.js')).href
);
const { PROJECTS, PROFILE } = await import(
  pathToFileURL(path.join(ssrDir, 'record.js')).href
);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

function head(title, description, canonical) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${description}" />`
    )
    .replace(
      /<link rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${canonical}" />`
    );
}

function emit(route, markup, title, description) {
  const canonical = `${PROFILE.site}${route === '/' ? '/' : route}`;
  const html = head(title, description, canonical).replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`
  );
  const outDir = route === '/' ? dist : path.join(dist, route);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  return Buffer.byteLength(html);
}

let total = 0;
let pages = 0;

// Home — the full record in one document.
total += emit(
  '/',
  renderToString(createElement(StaticApp, { route: '/' })),
  `${PROFILE.name} — ${PROFILE.title}, Boston`,
  'Applied AI engineer in Boston. Voice agents, retrieval systems, and full-stack AI products. Complete work history, projects, and recognition.'
);
pages++;

// Resume mode — ATS parsers and print pipelines read this without JS.
total += emit(
  '/resume',
  renderToString(createElement(StaticApp, { route: '/resume' })),
  `${PROFILE.name} — Resume`,
  `Resume of ${PROFILE.name}, ${PROFILE.title} in ${PROFILE.location}. Experience, education, awards, publications, and selected projects.`
);
pages++;

// One prerendered case study per project.
for (const p of PROJECTS) {
  const route = `/work/${p.slug}`;
  total += emit(
    route,
    renderToString(createElement(StaticApp, { route })),
    `${p.title} — ${PROFILE.name}`,
    p.summary.replace(/"/g, '&quot;')
  );
  pages++;
}

/**
 * Sitemap, generated from the same PROJECTS array that produced the pages.
 * Written here rather than hand-maintained in public/ so it can never list a
 * route that does not exist (a 404 in a sitemap costs crawl trust) or omit a
 * new project.
 */
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: '/', priority: '1.0', freq: 'weekly' },
  { loc: '/resume', priority: '0.9', freq: 'monthly' },
  ...PROJECTS.map((p) => ({
    loc: `/work/${p.slug}`,
    priority: '0.8',
    freq: 'monthly',
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${PROFILE.site}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap, 'utf8');

console.log(`prerendered ${pages} pages, ${(total / 1024).toFixed(1)} KB HTML total`);
console.log(`sitemap: ${urls.length} URLs`);

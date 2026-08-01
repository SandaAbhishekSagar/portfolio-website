import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Serve Vercel-style `api/*.js` handlers during `vite` / `vite preview`.
 * Without this, Vite treats /api/ask as a module URL and returns JS source
 * instead of running the retrieval handler — which is why the index looks "down".
 */

const ROUTES = {
  '/api/ask': 'ask.js',
  '/api/content': 'content.js',
  '/api/projects': 'projects.js',
  '/api/contact': 'contact.js',
};

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#') || !line.includes('=')) continue;
    const i = line.indexOf('=');
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function createRes(res) {
  const headers = {};
  let statusCode = 200;
  let ended = false;

  const api = {
    statusCode,
    setHeader(name, value) {
      headers[name.toLowerCase()] = value;
    },
    status(code) {
      statusCode = code;
      api.statusCode = code;
      return api;
    },
    json(body) {
      if (ended) return api;
      ended = true;
      const payload = JSON.stringify(body);
      res.statusCode = statusCode;
      for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
      if (!headers['content-type']) res.setHeader('Content-Type', 'application/json');
      res.end(payload);
      return api;
    },
    end(body) {
      if (ended) return api;
      ended = true;
      res.statusCode = statusCode;
      for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
      res.end(body ?? '');
      return api;
    },
  };
  return api;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return undefined;
  const raw = Buffer.concat(chunks).toString('utf8');
  const type = String(req.headers['content-type'] || '');
  if (type.includes('application/json')) {
    try {
      return JSON.parse(raw || '{}');
    } catch {
      return {};
    }
  }
  return raw;
}

export function apiRoutes() {
  const root = process.cwd();
  loadDotEnv(path.join(root, '.env.local'));
  loadDotEnv(path.join(root, '.env'));

  return {
    name: 'vite-api-routes',
    configureServer(server) {
      server.middlewares.use(apiMiddleware(root));
    },
    configurePreviewServer(server) {
      server.middlewares.use(apiMiddleware(root));
    },
  };
}

function apiMiddleware(root) {
  return async (req, res, next) => {
    const url = new URL(req.url || '/', 'http://localhost');
    const pathname = url.pathname.replace(/\/$/, '') || '/';
    const file = ROUTES[pathname];
    if (!file) return next();

    try {
      const abs = path.join(root, 'api', file);
      const mod = await import(`${pathToFileURL(abs).href}?t=${Date.now()}`);
      const handler = mod.default;
      if (typeof handler !== 'function') {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'API handler missing default export' }));
        return;
      }

      const body = ['POST', 'PUT', 'PATCH'].includes(req.method || '')
        ? await readBody(req)
        : undefined;

      const vercelReq = {
        method: req.method || 'GET',
        headers: req.headers,
        body,
        query: Object.fromEntries(url.searchParams),
        url: req.url,
      };

      await handler(vercelReq, createRes(res));
    } catch (err) {
      console.error(`[vite-api] ${pathname}`, err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err?.message || 'API error' }));
      }
    }
  };
}

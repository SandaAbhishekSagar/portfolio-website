/**
 * Adapt a Vercel-style (req, res) handler for Netlify Functions.
 * Keeps api/*.js unchanged so Vite local middleware and Netlify share one source.
 */
export function asNetlifyHandler(vercelHandler) {
  return async (event) => {
    const headers = {};
    let statusCode = 200;
    let body;
    let ended = false;

    const res = {
      statusCode,
      setHeader(name, value) {
        headers[name] = value;
      },
      status(code) {
        statusCode = code;
        this.statusCode = code;
        return this;
      },
      json(payload) {
        if (ended) return this;
        ended = true;
        body = JSON.stringify(payload);
        if (!headers['Content-Type'] && !headers['content-type']) {
          headers['Content-Type'] = 'application/json';
        }
        return this;
      },
      end(payload) {
        if (ended) return this;
        ended = true;
        body = payload ?? '';
        return this;
      },
    };

    let parsedBody;
    if (event.body) {
      const raw = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8')
        : event.body;
      const type = String(
        event.headers?.['content-type'] || event.headers?.['Content-Type'] || ''
      );
      if (type.includes('application/json')) {
        try {
          parsedBody = JSON.parse(raw || '{}');
        } catch {
          parsedBody = {};
        }
      } else {
        parsedBody = raw;
      }
    }

    const req = {
      method: event.httpMethod || event.requestContext?.http?.method || 'GET',
      headers: event.headers || {},
      body: parsedBody,
      query: event.queryStringParameters || {},
      url: event.rawUrl || event.path || '/',
    };

    await vercelHandler(req, res);

    return {
      statusCode,
      headers,
      body: body ?? '',
    };
  };
}

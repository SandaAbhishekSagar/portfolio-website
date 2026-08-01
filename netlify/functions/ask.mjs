import handler from '../../api/ask.js';
import { asNetlifyHandler } from './_vercel-bridge.mjs';

export const handler = asNetlifyHandler(handler);

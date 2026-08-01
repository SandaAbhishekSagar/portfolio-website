import handler from '../../api/content.js';
import { asNetlifyHandler } from './_vercel-bridge.mjs';

export const handler = asNetlifyHandler(handler);

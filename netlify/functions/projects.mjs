import handler from '../../api/projects.js';
import { asNetlifyHandler } from './_vercel-bridge.mjs';

export const handler = asNetlifyHandler(handler);

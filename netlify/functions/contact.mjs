import handler from '../../api/contact.js';
import { asNetlifyHandler } from './_vercel-bridge.mjs';

export const handler = asNetlifyHandler(handler);

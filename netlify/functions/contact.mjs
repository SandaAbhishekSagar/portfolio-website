import vercelHandler from '../../api/contact.js';
import { asNetlifyHandler } from '../lib/vercel-bridge.mjs';

export const handler = asNetlifyHandler(vercelHandler);

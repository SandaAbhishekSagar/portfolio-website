import vercelHandler from '../../api/ask.js';
import { asNetlifyHandler } from '../lib/vercel-bridge.mjs';

export const handler = asNetlifyHandler(vercelHandler);

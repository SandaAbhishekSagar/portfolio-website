import vercelHandler from '../../api/content.js';
import { asNetlifyHandler } from '../lib/vercel-bridge.mjs';

export const handler = asNetlifyHandler(vercelHandler);

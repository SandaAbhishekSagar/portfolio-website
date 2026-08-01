import vercelHandler from '../../api/projects.js';
import { asNetlifyHandler } from '../lib/vercel-bridge.mjs';

export const handler = asNetlifyHandler(vercelHandler);

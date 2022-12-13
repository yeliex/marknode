import { resolve } from 'node:path';

export const CONTEXT_DIR = resolve(new URL(import.meta.url).pathname, '../../context');

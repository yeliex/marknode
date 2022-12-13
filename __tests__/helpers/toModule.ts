import { CONTEXT_DIR } from './consts.js';
import { writeFile } from 'node:fs/promises';

const toModule = async (code: string) => {
    const { currentTestName } = expect.getState();

    const path = `${CONTEXT_DIR}/${currentTestName}.mjs`;

    await writeFile(path, code, 'utf8');

    const m = (await import(path) as any).default;

    return m;
};

export default toModule;

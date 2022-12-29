import { createExport } from '../utils.js';

export default function jsxMetaOutput() {
    return (tree: any, file: any) => {
        const obj = {
            meta: file.meta,
            title: file.title,
            toc: file.toc,
        };

        tree.children.unshift(createExport(obj));
    };
}

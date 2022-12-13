import { type Parent, type Content } from 'hast';

import mdxJsxFlowElement from './mdxJsxFlowElement.js';

const Handlers = {
    mdxJsxFlowElement,
};

const handler = (node: Content, index: number | null, parent: Parent) => {
    if (node.position) {
        delete node.position;
    }

    if (node.type in Handlers) {
        (Handlers[node.type as keyof typeof Handlers] as any)(node, index, parent);
    }
};

export default handler;

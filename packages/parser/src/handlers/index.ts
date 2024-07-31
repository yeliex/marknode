import { type Content, type Parent } from 'hast';

import mdxJsxFlowElement from './mdxJsxFlowElement.js';
import mdxJsxTextElement from './mdxJsxTextElement.js';
import text from './text.js';

const Handlers = {
    mdxJsxFlowElement,
    mdxJsxTextElement,
    text,
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

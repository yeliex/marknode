import { MdxJsxTextElement } from 'mdast-util-mdx';
import { Parent } from 'hast';
import { attributeHandler } from './mdxJsxFlowElement.js';

const mdxJsxTextElement = (node: MdxJsxTextElement, index: number, parent: Parent) => {
    parent.children[index] = {
        type: 'element',
        tagName: node.name!,
        properties: attributeHandler(node.attributes),
        children: node.children as any,
    }
}

export default mdxJsxTextElement;

import { type Parent } from 'hast';
import { type MdxJsxFlowElement } from 'mdast-util-mdx';
import mdxJsxAttributeHandler from './mdxJsxAttribute.js';
import mdxJsxExpressionAttributeHandler from './mdxJsxExpressionAttribute.js';

const AttributeHandlers = {
    mdxJsxAttribute: mdxJsxAttributeHandler,
    mdxJsxExpressionAttribute: mdxJsxExpressionAttributeHandler,
};

const mdxJsxFlowElementHandler = (node: MdxJsxFlowElement, index: number, parent: Parent) => {
    if (node.name === 'br') {
        parent.children[index] = {
            type: 'element',
            tagName: 'br',
            properties: {},
            children: [],
        };

        return;
    }

    parent.children[index] = node.name ? {
        type: 'component',
        name: node.name,
        properties: node.attributes.reduce((acc: any, attr: any) => {
            acc[attr.name] = AttributeHandlers[attr.type as keyof typeof AttributeHandlers](attr);

            return acc;
        }, {}),
        children: node.children as any,
    } : {
        type: 'element',
        tagName: 'fragment',
        children: node.children as any,
    };
};

export default mdxJsxFlowElementHandler;

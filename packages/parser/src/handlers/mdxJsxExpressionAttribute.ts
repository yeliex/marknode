import { type MdxJsxExpressionAttribute } from 'mdast-util-mdx';
import { VFileMessage } from 'vfile-message';

// ExpressionAttribute like <test {...a} />

const mdxJsxExpressionAttributeHandler = (node: MdxJsxExpressionAttribute) => {
    console.log(node)
    throw new VFileMessage('Unsupported JSX Expression Attribute', node.data?.estree?.loc!);
};

export default mdxJsxExpressionAttributeHandler;

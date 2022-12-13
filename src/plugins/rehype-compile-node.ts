import { Processor } from 'unified';
import { visit } from 'unist-util-visit';
import handler from '../handlers/index.js';

function rehypeCompileNode(this: Processor) {
    function compiler(tree: any) {
        visit(tree, handler);

        return tree;
    }

    Object.assign(this, { Compiler: compiler });
}

export default rehypeCompileNode;

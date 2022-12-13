import { visit } from 'unist-util-visit';
import { headingRank } from 'hast-util-heading-rank';
import { toString } from 'mdast-util-to-string';

interface Options {
    removeTitle?: boolean;
}

export default function rehypeTitle(options: Options = {}) {
    return (tree: any, file: any) => {
        visit(tree, 'element', (node, index, parent) => {
            const level = headingRank(node);

            if (level === 1 && !file.title) {
                file.title = toString(node);

                if(options.removeTitle) {
                    parent.children.splice(index, 1);
                }
            }
        });
    };
}

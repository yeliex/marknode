import { headingRank } from 'hast-util-heading-rank';
import { toString } from 'mdast-util-to-string';
import { remove } from 'unist-util-remove';
import { visit } from 'unist-util-visit';

interface Options {
    removeTitle?: boolean;
}

export default function rehypeTitle(options: Options = {}) {
    return (tree: any, file: any) => {
        visit(tree, 'element', (node, _index, parent) => {
            const level = headingRank(node);

            if (level === 1 && !file.title) {
                file.title = toString(node);

                if (options.removeTitle) {
                    remove(parent, (n) => n === node);
                }
            }
        });
    };
}

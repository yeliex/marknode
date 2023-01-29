import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import { headingRank } from 'hast-util-heading-rank';

export default function rehypeToc() {
    return (tree: any, file: any) => {
        const list: any[] = [];

        visit(tree, 'element', (node) => {
            const level = headingRank(node);

            if (level) {
                list.push({
                    title: toString(node),
                    id: node.properties.id,
                    level,
                });
            }
        });

        file.toc = list;
    };
}

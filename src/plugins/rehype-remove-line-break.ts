import { remove } from 'unist-util-remove';
import { visit } from 'unist-util-visit';

export default function rehypeRemoveLineBreak() {
    return (tree: any) => {
        remove(tree, (node) => {
            return node.type === 'text' &&
                node.value === '\n';
        });

        visit(tree, 'text', (node, index, parent) => {
            if (node.value.startsWith('\n')) {
                const before = parent.children[index! - 1];
                if (before && before.type === 'element' && before.tagName === 'br') {
                    node.value = node.value.replace(/^\n/, '');
                }
            }

            if(node.value.endsWith('\n')) {
                const after = parent.children[index! + 1];
                if (after && after.type === 'element' && after.tagName === 'br') {
                    node.value = node.value.replace(/\n$/, '');
                }
            }
        });
    };
}

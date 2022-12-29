import { parse as parseToml } from 'toml';
import { parse as parseYaml } from 'yaml';
import { remove } from 'unist-util-remove';

export default function remarkMeta() {
    return (tree: any, file: any) => {
        const meta = {};

        for (const node of tree.children) {
            if (node.type === 'yaml') {
                Object.assign(meta, parseYaml(node.value));
                remove(tree, node);
            } else if (node.type === 'toml') {
                Object.assign(meta, parseToml(node.value));
                remove(tree, node);
            }
        }

        file.meta = meta;
    };
}

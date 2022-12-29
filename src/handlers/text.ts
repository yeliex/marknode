import type { Text, Parent } from 'hast';

const textHandler = (node: Text, index: number, parent: Parent) => {
    const value = String(node.value || '');

    if(!value) {
        parent.children.splice(index, 1);
    } else {
        node.value = value;
    }
};

export default textHandler;

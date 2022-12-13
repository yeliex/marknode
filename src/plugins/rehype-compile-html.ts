import { Processor } from 'unified';
import { visit } from 'unist-util-visit';
import { toHtml } from 'hast-util-to-html';
import handler from '../handlers/index.js';
import { type Component } from '../index.js';

export interface HtmlNodeItem {
    type: 'html';
    value: string;
}

export interface ComponentNode extends Omit<Component, 'children'> {
    children?: HtmlNode[];
}

export type HtmlNode = HtmlNodeItem | ComponentNode;

const treeToHtmlGroup = (tree: any[]) => {
    const group: any[] = [];

    let currentItem: any = null;

    tree.forEach((item: any) => {
        if (item.type === 'component') {
            group.push(currentItem);
            group.push(item);
            currentItem = null;
        } else {
            currentItem = currentItem || [];
            currentItem.push(item);
        }
    });

    currentItem && group.push(currentItem);

    return group;
};

function rehypeCompileHtml(this: Processor) {
    const walkThroughNodes = (tree: any[]): HtmlNode[] => {
        const groups = treeToHtmlGroup(tree);

        return groups.map((group) => {
            if (Array.isArray(group)) {
                return {
                    type: 'html',
                    content: toHtml(group),
                };
            }

            return {
                ...group,
                children: group.children ? walkThroughNodes(group.children) : undefined,
            };
        });
    };

    function compiler(tree: any) {
        visit(tree, handler);

        return walkThroughNodes(tree.children);
    }

    Object.assign(this, { Compiler: compiler });
}

export default rehypeCompileHtml;

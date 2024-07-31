import Slugger from 'github-slugger';
import { Element, ElementContent, Node, Parent, Text } from 'hast';
import { headingRank } from 'hast-util-heading-rank';
import set from 'lodash.set';
import { toString } from 'mdast-util-to-string';
import { remove } from 'unist-util-remove';
import { SKIP, visit } from 'unist-util-visit';
import { VisitorResult } from 'unist-util-visit-parents/complex-types.js';

export const slugs = new Slugger();

const styleProperties: Array<
    string |
    [string, string] |
    [string, [string, string]]
> = [
    'width',
    'height',
    'max-height',
    'max-width',
    'overflow',
    'overflow-x',
    'overflow-y',
    'opacity',

    // align
    'text-align',
    ['align', 'text-align'],
    ['center', ['text-align', 'center']],
    ['align-center', ['text-align', 'center']],
    ['align-left', ['text-align', 'left']],
    'float',
    ['float-left', ['float', 'left']],
    ['float-right', ['float', 'right']],

    // text
    'color',
    'font-size',
    ['size', 'font-size'],
    'font',
    'font-family',
    'font-style',
    ['italic', ['font-style', 'italic']],
    ['oblique', ['font-style', 'oblique']],
    'font-weight',
    ['weight', 'font-weight'],
    ['font-thin', ['font-weight', '100']],
    ['font-extralight', ['font-weight', '200']],
    ['font-lighter', ['font-weight', '300']],
    ['font-normal', ['font-weight', '400']],
    ['font-medium', ['font-weight', '500']],
    ['font-semibold', ['font-weight', '600']],
    ['font-bold', ['font-weight', '700']],
    ['font-extrabold', ['font-weight', '800']],
    ['font-black', ['font-weight', '900']],
    'letter-spacing',
    ['tracking', 'letter-spacing'],
    'line-break',
    'line-height',
    ['leading', 'line-height'],
    'text-decoration',
    ['decoration', 'text-decoration'],
    ['underline', ['text-decoration', 'underline']],
    ['line-through', ['text-decoration', 'line-through']],
    'text-indent',
    ['indent', 'text-indent'],
    'white-space',
    'word-break',
    'word-wrap',

    // position
    ...['', 'top', 'left', 'right', 'bottom'].reduce((total: string[], position) => {
        ['margin', 'padding'].forEach((type) => {
            total.push([type, position].filter(Boolean).join('-'));
        });

        return total;
    }, []),


    // background
    'background',
    ['bg', 'background'],

    // border
    ...['', 'top', 'left', 'right', 'bottom'].reduce((total: string[], position) => {
        ['', 'width', 'color', 'style'].forEach((type) => {
            total.push(['border', position, type].filter(Boolean).join('-'));
        });

        return total;
    }, []),

    // display
    ['hidden', ['display', 'none']],

    // others
    'cursor',
    'direction',
    ['ltr', ['direction', 'ltr']],
    ['rtl', ['direction', 'rtl']],
    'user-select',
    ['selectable', ['user-select', 'auto']],
    ['unselectable', ['user-select', 'none']],
];

const StyleProperties = new Map<string, string | [string, string]>(styleProperties.map((item) => {
    if (typeof item === 'string') {
        return [item, item];
    }

    return item;
}));

type IProps = {
    maintainCase?: boolean | undefined
}

const EXTRACT_PROPERTY_REGEX = /^(.*?)\s+{([#\w-_=.,]+)}$/i;

const EXTRACT_NEXT_PROPERTY_REGEX = /^{>([#\w-_=.,]+)}$/i;

export default function rehypeCustomProperties(props: IProps = {}) {
    const { maintainCase = false } = props;

    return (tree: Node) => {
        slugs.reset();

        visit(tree, 'element', (node: Element, index: number, parent: Parent): VisitorResult => {
            if (!node.children.length) {
                return;
            }

            /**
             * for heading, simple and inline only
             *
             * # Heading {#id}
             */
            if (headingRank(node)) {
                handleSimple(node);

                if (node.properties && !node.properties.id) {
                    node.properties.id = slugs.slug(toString(node), maintainCase);
                }

                return;
            }

            /**
             * for block element, like list. append properties to sibling
             *
             * {>width=100%}
             * - xxx
             * - xxx
             */
            if (node.children.length === 1 && node.tagName === 'p') {
                const text = toString(node.children[0]);

                const match = EXTRACT_NEXT_PROPERTY_REGEX.exec(text);

                if (match) {
                    const properties = parseProperty(match[1]);

                    let sibling = parent.children[index + 1];

                    while (sibling && sibling.type === 'text' && sibling.value === '\n') {
                        remove(parent, (node) => node === sibling);
                        sibling = parent.children[index + 1];
                    }

                    remove(parent, (n) => n === node);

                    if (!sibling) {
                        return;
                    }

                    if (sibling.type !== 'element') {
                        sibling = {
                            type: 'element',
                            tagName: 'div',
                            properties: {},
                            children: [sibling as ElementContent],
                        } as Element;

                        parent.children.splice(index, 0, sibling);
                    }

                    appendProperiesToNode(sibling, properties);

                    return [SKIP, index];
                }
            }

            /**
             * for paragraph, inline or multi line
             *
             * if inline, add span element with properties
             */
            if (node.children.length === 1) {
                handleSimple(node);

                return;
            }

            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];

                if (child.type === 'text') {
                    const match = EXTRACT_PROPERTY_REGEX.exec(toString(child));

                    if (match) {
                        child.value = match[1];

                        const el = {
                            type: 'element',
                            tagName: 'span',
                            properties: {},
                            children: [child as ElementContent],
                        } as Element;

                        appendProperiesToNode(el, parseProperty(match[2]));

                        node.children[i] = el;
                    }
                }
            }
        });
    };
}

function handleSimple(node: Element) {
    const last = node.children[node.children.length - 1] as Text;

    const text = toString(last);

    const match = EXTRACT_PROPERTY_REGEX.exec(text);

    if (!match) {
        return;
    }

    last.value = match[1];

    appendProperiesToNode(node, parseProperty(match[2]));
}

type Properties = {
    id?: string;
    style?: Record<string, string>;
} & Record<string, string>;

function parseProperty(test: string): Properties {
    return test.split(',').reduce((total: Properties, part) => {
        if (part.startsWith('#')) {
            total.id = part.slice(1);
            return total;
        }

        const [key, value] = part.split('=');

        const styleConfig = StyleProperties.get(key);

        if (!styleConfig) {
            set(total, key, value || 'true');

            return total;
        }

        if (Array.isArray(styleConfig)) {
            set(total, ['style', styleConfig[0]], styleConfig[1]);

            return total;
        } else if (value) {
            set(total, ['style', styleConfig], value);
        }

        return total;
    }, {});
}

function appendProperiesToNode(node: Element, { id, style, ...props }: Properties) {
    node.properties = {
        ...(node.properties || {}),
        ...props,
        style: style ? {
            ...(node.properties?.style as any || {}),
            ...style,
        } : node.properties?.style,
        id: node.properties?.id || id,
    };
}

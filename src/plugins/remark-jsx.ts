import { mdxJsx } from 'micromark-extension-mdx-jsx';
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx';
import { Parser } from 'acorn';
import acornJsx from 'acorn-jsx';
import { Processor } from 'unified';

export default function remarkJSX(this: Processor) {
    const data = this.data();

    /**
     * @param {string} field
     * @param {unknown} value
     */
    function add(field: string, value: unknown) {
        const list = (
            data[field] ? data[field] : (data[field] = [])
        ) as unknown[];

        list.push(value);
    }

    add('micromarkExtensions', mdxJsx({
        acorn: Parser.extend(acornJsx()),
        acornOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        addResult: true,
    }));

    add('fromMarkdownExtensions', mdxFromMarkdown());
    add('toMarkdownExtensions', mdxToMarkdown());
}

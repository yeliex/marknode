import { MDComponent } from '@oh-markdown/react';
import { Processor } from 'oh-markdown';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const md = `# Hello World {#hello,center}

## list {font-semibold,color=#777777}

{>color=red}
- 1 {color=blue}
- 2

center-test {center}

important {color=red,font-semibold}
multi-line
        `;

describe('Render Node Result', () => {
    const processor = new Processor();

    test('should render', async () => {
        const result = await processor.toNode(
            `# Hello World

## sub

- 1
- 2

`,
        );

        const str = renderToStaticMarkup(
            createElement(MDComponent, {
                nodes: result.data,
            }),
        );

        expect(str).toMatchSnapshot();
    });

    test('should render custom properties', async () => {
        const result = await processor.toNode(md);

        const str = renderToStaticMarkup(
            createElement(MDComponent, {
                nodes: result.data,
            }),
        );

        expect(str).toMatchSnapshot();
    });
});

describe('Render Html Result', () => {
    const processor = new Processor();

    test('should render', async () => {
        const result = await processor.toHtml(
            `# Hello World

## sub

- 1
- 2

`,
        );

        const str = renderToStaticMarkup(
            createElement(MDComponent, {
                nodes: result.data,
            }),
        );

        expect(str).toMatchSnapshot();
    });

    test('should render custom properties', async () => {
        const result = await processor.toHtml(md);

        const str = renderToStaticMarkup(
            createElement(MDComponent, {
                nodes: result.data,
            }),
        );

        expect(str).toMatchSnapshot();
    });
});

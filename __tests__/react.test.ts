import { Processor } from 'oh-markdown';
import { MDComponent } from '@oh-markdown/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

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
});

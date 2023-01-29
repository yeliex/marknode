import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Processor } from '../packages/parser/src/index.js';
import toModule from './helpers/toModule.js';

describe('Output JSX', () => {
    const processor = new Processor();

    test('should stringify react', async () => {
        const result = await processor.toJsx(
            `# Hello World`,
        );

        const component = await toModule(result.data);

        const str = renderToStaticMarkup(createElement(component));

        expect(str).toBe('<h1 id="hello-world">Hello World</h1>');
        expect(result.title).toBe('Hello World');
    });

    test('should not generate toc default', async () => {
        const result = await processor.toJsx(
            `# Hello World`,
        );

        expect(result.toc).toBeUndefined();
    });

    test('should generate toc', async () => {
        const result = await processor.toJsx(
            `# Hello World\n\n## Subtitle`,
            { toc: true },
        );

        expect(result.toc).not.toBeUndefined();
        expect(result.toc).toHaveLength(2);
        expect(result.toc![0]).toEqual({ id: 'hello-world', level: 1, title: 'Hello World' });
        expect(result.toc![1]).toEqual({ id: 'subtitle', level: 2, title: 'Subtitle' });
    });
});

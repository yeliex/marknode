import { Processor } from 'oh-markdown';

const md = `# Hello World {#hello,center}

## list {font-semibold,color=#777777}

{>color=red}
- 1 {color=blue}
- 2

center-test {center}

important {color=red,font-semibold}
multi-line
        `;

describe('Parse Custom Properties', () => {
    test('should parse custom properties', async () => {
        const processor = new Processor({ debug: true });

        const result = processor.parse(md);

        expect(result).toMatchSnapshot();
    });

    test('should convert custom properties to html', async () => {
        const processor = new Processor({ debug: true });

        const result = await processor.toHtml(md);

        expect(result).toMatchSnapshot();
    });

    test('should convert custom properties to node', async () => {
        const processor = new Processor({ debug: true });

        const result = await processor.toNode(md);

        expect(result).toMatchSnapshot();
    });
});



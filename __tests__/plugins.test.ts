import { Processor } from 'oh-markdown';

const md = `# Hello World {#hello,center}

## list {font-semibold,color=#777777}

{>color=red}
- 1 {color=blue}
- 2

center-test {center}

important {color=red,font-semibold}
multi-line

[link](https://www.github.com) {color=red}

![image](https://github.githubassets.com/assets/mona-loading-default-c3c7aad1282f.gif) {width=100px,center}
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



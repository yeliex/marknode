import { Processor } from '../src/index.js';

describe('Output as Node', () => {
    const processor = new Processor();

    test('should output node', async () => {
        const result = processor.toNode(
            `# Hello World

## sub

- 1
- 2

`,
        );

        expect(result).toMatchSnapshot();
    });

    test('should support HTML tag', async () => {
        const result = processor.toNode(
            `# Hello World

<test string="string" number={1} array={[1, 'string', {obj: true}]} object={{obj: true}} />
`,
        );

        expect(result).toMatchSnapshot();
    });

    test('should support HTML tag with children', async () => {
        const result = processor.toNode(
            `# Hello World

<test>
children content
</test>
`,
        );

        expect(result).toMatchSnapshot();
    });

    test('should support HTML tag with children markdown', async () => {
        const result = processor.toNode(
            `# Hello World

<test>
> blockquote
</test>
`,
        );

        expect(result).toMatchSnapshot();
    });
});

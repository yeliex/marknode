import { Processor } from 'oh-markdown';

describe('Output as Html', () => {
    const processor = new Processor();

    test('should output html', async () => {
        const result = await processor.toHtml(
            `# Hello World

- 123
- 123

asd
asd

## asd
asd

<br />

test content`,
            {
                toc: true,
            }
        );

        expect(result).toMatchSnapshot();
    });
});

import { Processor } from '../src/index.js';

describe('Parse', () => {
    test('should parse', async () => {
        const processor = new Processor();
        const result: any = processor.parse('# Hello World');

        expect(result.type).toBe('root');
        expect(result.children.length).toBe(1);
        expect(result.children[0].type).toBe('heading');
        expect(result.children[0].depth).toBe(1);
        expect(result.children[0].children[0].type).toBe('text');
        expect(result.children[0].children[0].value).toBe('Hello World');
    });

    test('should parse front-matter yaml', async () => {
        const processor = new Processor();
        const result: any = processor.parse(
            `---
matter: front
---

# Hello World`);

        expect(result.type).toBe('root');
        expect(result.children[0].type).toBe('yaml');
        expect(result.children[0].value).toBe('matter: front');
        expect(result.children[1].type).toBe('heading');
        expect(result.children[1].depth).toBe(1);
        expect(result.children[1].children[0].type).toBe('text');
        expect(result.children[1].children[0].value).toBe('Hello World');
    });

    test('should parse front-matter toml', async () => {
        const processor = new Processor();
        const result: any = processor.parse(
            `+++
matter: front
+++

# Hello World`);

        expect(result.type).toBe('root');
        expect(result.children[0].type).toBe('toml');
        expect(result.children[0].value).toBe('matter: front');
        expect(result.children[1].type).toBe('heading');
        expect(result.children[1].depth).toBe(1);
        expect(result.children[1].children[0].type).toBe('text');
        expect(result.children[1].children[0].value).toBe('Hello World');
    });
});

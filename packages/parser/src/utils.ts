import { name as isValidIdentifierName } from 'estree-util-is-identifier-name';
import { valueToEstree } from 'estree-util-value-to-estree';

export const optionsToString = (options?: any) => {
    if (!options) return 'default';

    if (typeof options === 'string') return options;

    if (typeof options === 'object' && !Object.keys(options).length) return 'default';

    return JSON.stringify(options);
};

export const createExport = (object: Record<string, any>) => {
    return {
        type: 'mdxjsEsm',
        value: '',
        data: {
            estree: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        specifiers: [],
                        declaration: {
                            type: 'VariableDeclaration',
                            kind: 'const',
                            declarations: Object.entries(object).map(([identifier, val]) => {
                                if (!isValidIdentifierName(identifier)) {
                                    throw new Error(`Meta keys should be valid identifiers, got: ${JSON.stringify(
                                        identifier)}`);
                                }
                                return {
                                    type: 'VariableDeclarator',
                                    id: { type: 'Identifier', name: identifier },
                                    init: valueToEstree(val),
                                };
                            }),
                        },
                    },
                ],
            },
        },
    };
}


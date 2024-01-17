import type { ObjectExpression } from 'estree';
import * as AllowedStatements from '../statements/index.js';
import { VFileMessage } from 'vfile-message';

const ObjectExpressionStatement = (expression: ObjectExpression) => {
    const result: Record<string, any> = {};

    expression.properties.forEach((property) => {
        if (property.type !== 'Property') {
            throw new VFileMessage(`Unsupported ObjectExpression Property, type: ${property.type}`, property.loc!);
        }

        const { key, value } = property;

        if (key.type !== 'Identifier') {
            throw new VFileMessage(`Unsupported ObjectExpression Property Key, type: ${key.type}`, key.loc!);
        }

        if (property.shorthand) {
            throw new VFileMessage(
                `Unsupported ObjectExpression Property: ${key.name}, shorthand not supported`,
                property.loc!,
            );
        }

        if (property.method) {
            throw new VFileMessage(
                `Unsupported ObjectExpression Property: ${key.name}, method not supported`,
                property.loc!,
            );
        }

        if (!(value.type in AllowedStatements)) {
            throw new VFileMessage(
                `Unsupported ObjectExpression Property: ${key.name}, type: ${property.type}`,
                property.loc!,
            );
        }

        result[key.name] = AllowedStatements[value.type as keyof typeof AllowedStatements](value as any);
    });

    return Object.freeze(result);
};

export default ObjectExpressionStatement;

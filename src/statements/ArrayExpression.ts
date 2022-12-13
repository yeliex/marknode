import { type ArrayExpression } from 'estree';
import * as AllowedStatements from '../statements/index.js';
import { VFileMessage } from 'vfile-message';

const ArrayExpressionStatement = (statement: ArrayExpression): any[] => {
    return statement.elements.map((element, index) => {
        if (!element) {
            throw new VFileMessage('ArrayExpression element is null', statement.loc!);
        }
        if (!element.type) {
            throw new VFileMessage(
                `Unsupported ArrayExpression Member, index: ${index}, type: unkonwn`,
                (element as any).loc || statement.loc,
            );
        }
        if (!(element.type in AllowedStatements)) {
            throw new VFileMessage(
                `Unsupported ArrayExpression Member, index: ${index}, type: ${element.type}`,
                element.loc!,
            );
        }

        return AllowedStatements[element.type as keyof typeof AllowedStatements](element as any);
    });
};

export default ArrayExpressionStatement;

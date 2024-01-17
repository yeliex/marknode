import type { Literal } from 'estree';

const LiteralStatement = (expression: Literal) => {
    return expression.value;
};

export default LiteralStatement;

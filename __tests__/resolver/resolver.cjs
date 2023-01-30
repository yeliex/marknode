const baseResolver = require('ts-jest-resolver');
const Path = require('path');

const map = ['oh-markdown', '@oh-markdown/react'];

function resolver(id, options) {
    if (map.includes(id)) {
        return Path.resolve(require.resolve(`${id}/package.json`), '../src/index.ts');
    }

    return baseResolver(id, options);
}

module.exports = resolver;

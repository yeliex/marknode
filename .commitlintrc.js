module.exports = {
    extends: [
        '@commitlint/config-conventional',
    ],
    ignores: [
        require('@commitlint/is-ignored').default,
        (msg) => msg.match(/^(wip|WIP)(:|\.)/),
    ],
};

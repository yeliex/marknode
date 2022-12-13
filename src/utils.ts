export const optionsToString = (options?: any) => {
    if (!options) return 'default';

    if (typeof options === 'string') return options;

    if (typeof options === 'object' && !Object.keys(options).length) return 'default';

    return JSON.stringify(options);
};

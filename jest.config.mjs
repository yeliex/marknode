/**
 * {@type {import('jest').Config}
 */
const config = {
    bail: false,
    testEnvironment: 'node',
    testMatch: [
        '<rootDir>/**/*.test.ts',
    ],
    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
    },
    transformIgnorePatterns: [],
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: [
        'json-summary',
        'text-summary',
        'html',
        'lcov',
        'cobertura',
    ],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    resolver: '<rootDir>/__tests__/resolver/resolver.cjs',
    extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx']
};

export default config;

module.exports = {
    env: {
        browser: true,
        es6: true,
        jquery: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module'
    },
    rules: {
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
        semi: ['error', 'always'],
        'linebreak-style': 0,
        'no-console': 'off',
        'no-unused-vars': 'off'
    }
};

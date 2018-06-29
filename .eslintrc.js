module.exports =
{
    'env':
    {
        'browser': true,
        'es6': true,
        'jquery': true
    },
    'extends': 'eslint:recommended',
    'parserOptions':
    {
        'ecmaVersion': 2017,
        'sourceType': 'module'
    },
    'rules':
    {
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'linebreak-style': 'no',
        'no-console': 'off',
        'no-unused-vars': 'off'
    }
};
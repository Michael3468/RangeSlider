module.exports = {
  env: {
    browser: true,
    es2021: true,
    es6: true,
    jquery: true,
    jest: true,
  },
  globals: {
    JQuery: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'dot-notation': 0,
    'import/no-extraneous-dependencies': 0,
    'no-param-reassign': [
      'error', { props: true, ignorePropertyModificationsFor: ['$'] },
    ],
    // note you must disable the base rule as it can report incorrect errors
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    // note you must disable the base rule as it can report incorrect errors
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions', 'methods'] }],

    'max-classes-per-file': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};

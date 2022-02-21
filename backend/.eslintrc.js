module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parserOptions: {
    project: './tsconfig.json',
    "ecmaVersion": 12,
  },
  root: true,
  env: {
    node: true,
    jest: true,
    es2021: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/ban-types': 'off',
  },
};

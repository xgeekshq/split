// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const folders = fs
	.readdirSync('src', { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => dirent.name);

module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
		project: './tsconfig.json'
	},
	plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort', 'import', 'unused-imports'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'airbnb-base',
		'airbnb-typescript/base',
		'plugin:prettier/recommended',
		'prettier'
	],
	root: true,
	env: {
		node: true,
		jest: true,
		es2021: true
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'no-underscore-dangle': 'off',
		'class-methods-use-this': 'off',
		'no-param-reassign': 'off',
		'import/prefer-default-export': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'import/no-cycle': 'off',
		'prefer-destructuring': 'off',
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
		'unused-imports/no-unused-imports': 'error',
		'no-plusplus': 'off',
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'variableLike',
				format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
				leadingUnderscore: 'allow'
			}
		],
		'prettier/prettier': ['error', { usePrettierrc: true }]
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.ts'],
				moduleDirectory: ['node_modules', 'src/']
			}
		}
	},
	overrides: [
		{
			files: ['**/*.ts?(x)'],
			rules: {
				'simple-import-sort/imports': [
					'error',
					{
						groups: [['^@?\\w'], [`^(${folders.join('|')})(/.*|$)`], ['^', '^\\.']]
					}
				]
			}
		}
	]
};

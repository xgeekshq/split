module.exports = {
	moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
	rootDir: '.',
	roots: ['<rootDir>/src'],
	testRegex: '.spec.ts$',
	transform: {
		'^.+\\.ts?$': 'ts-jest'
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: './src/test/coverage',
	testEnvironment: 'node',
	modulePathIgnorePatterns: [
		'<rootDir>/dist/',
		'<rootDir>/coverage/',
		'.module.ts',
		'main.ts',
		'.eslintrc.js',
		'jest.config.js',
		'jest.config.ts',
		'configuration.ts',
		'src/test/coverage/'
	],
	modulePaths: ['<rootDir>/src']
	// moduleDirectories: ['node_modules', 'src'],
};

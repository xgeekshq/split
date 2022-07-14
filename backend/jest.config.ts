module.exports = {
	moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
	rootDir: '.',
	testRegex: '.spec.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest'
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
	]
};

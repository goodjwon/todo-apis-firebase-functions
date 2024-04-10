module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
	  '^.+\\.(ts|tsx)$': 'babel-jest',
	},
	moduleNameMapper: {
	  '^@/(.*)$': '<rootDir>/src/$1',
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
  
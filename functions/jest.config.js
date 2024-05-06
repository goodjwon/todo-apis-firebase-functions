module.exports = {
	setupFilesAfterEnv: ['./jest.setup.js'],
	transform: {
	  '^.+\\.(js|ts)$': 'babel-jest'
	},
	testEnvironment: 'node',
	transformIgnorePatterns: ['node_modules/(?!(@firebase|firestore-jest-mock))'],
  };
  
const rootPath = process.cwd()

/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
module.exports = {
  rootDir: rootPath,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node'
    // "mjs",
    // "cjs",
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tools/jest/__mocks__/fileMock.js',
    '\\.(css|scss|sass)$': 'identity-obj-proxy', // mocking CSS modules
    // alias
    '^@/(.*)$': '<rootDir>/$1'
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tools/jest/jest.setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic'
            }
          }
        }
      }
    ]
  }
}

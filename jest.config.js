module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: '<rootDir>setup-test.js',
  testPathIgnorePatterns: ['/node_modules/', 'rsg-components', 'dist', 'docs', 'styleguide'],
}

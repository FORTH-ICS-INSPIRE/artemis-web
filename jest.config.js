// jest.config.js
module.exports = {
  transform: { '^.+\\.tsx?$': 'ts-jest' },
   moduleNameMapper: { '\\.(css|less)$': '<rootDir>/styleMock.js' },
    setupFiles: ['<rootDir>/jest.setup.js'],
   }

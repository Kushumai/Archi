export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: './',
    moduleDirectories: ['node_modules', '<rootDir>'],
    testRegex: '.*\\.spec\\.ts$',
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/main.ts',
      '!src/**/*.module.ts',
      '!src/**/*.dto.ts',
      '!src/**/*.entity.ts',
    ],
    coverageDirectory: 'coverage',
  };
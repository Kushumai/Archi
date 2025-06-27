import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", 
  },
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: [
  "**/__tests__/**/*.test.ts",
  "**/__tests__/**/*.test.tsx",
  "**/?(*.)+(spec|test).ts",
  "**/?(*.)+(spec|test).tsx"
],
};

export default createJestConfig(config);
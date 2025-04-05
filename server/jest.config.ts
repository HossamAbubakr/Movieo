import type { Config } from "jest";
/** @type {import('ts-jest').JestConfigWithTsJest} **/

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  setupFilesAfterEnv: ["./tests/config.ts"],
};

export default config;

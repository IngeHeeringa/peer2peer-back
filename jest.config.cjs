/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/**/*.test.ts"],
  resolver: "jest-ts-webcompat-resolver",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/server/cors.ts",
    "!src/index.ts",
    "!src/server/index.ts",
    "!src/server/startServer.ts",
    "!src/loadEnvironment.ts",
    "!src/database/connectDatabase.ts",
  ],
};

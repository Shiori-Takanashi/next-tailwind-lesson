// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};

module.exports = createJestConfig(customJestConfig);

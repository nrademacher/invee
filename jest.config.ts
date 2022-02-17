import nextJest from 'next/jest'
import type { Config } from '@jest/types'

const createJestConfig = nextJest({
    dir: './',
})

const config: Config.InitialOptions = {
    verbose: true,
    roots: ['<rootDir>'],
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['**/tests/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    testPathIgnorePatterns: ['<rootDir>/.next', '<rootDir>/playwright/'],
    transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
    moduleNameMapper: {
        '^@components(.*)$': '<rootDir>/components$1',
        '^@lib(.*)$': '<rootDir>/lib$1',
    },
}

export default createJestConfig(config)

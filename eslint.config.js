// eslint.config.js
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        localStorage: 'readonly',
        alert: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        URL: 'readonly',
        import: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-console': 'off',
      'quotes': ['warn', 'single'],
      'semi': ['warn', 'always'],
      'indent': ['warn', 2],
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      'eol-last': ['warn', 'always'],
      'comma-dangle': ['warn', 'never'],
      'arrow-spacing': ['warn', { before: true, after: true }],
      'object-curly-spacing': ['warn', 'always'],
      'array-bracket-spacing': ['warn', 'never']
    }
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.config.js',
      'playwright.config.js',
      'vitest.config.js'
    ]
  }
];

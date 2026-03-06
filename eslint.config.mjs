import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import jestPlugin from 'eslint-plugin-jest';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/migrations/**',
      '**/generated/**',
      'yarn.lock',
    ],
  },

  // Base configs
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  reactPlugin.configs.flat.recommended,
  reactHooksPlugin.configs['recommended-latest'],
  jestPlugin.configs['flat/recommended'],
  jestPlugin.configs['flat/style'],

  // Project-wide config
  {
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
    },
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'react/prop-types': 'off',
      'react/display-name': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            Array:
              'Use a typed array instead, e.g. string[] or Array<string>',
          },
        },
      ],
      'no-return-await': 'warn',
      'no-trailing-spaces': ['error', { ignoreComments: true }],
      'no-fallthrough': 'error',
      'jest/valid-expect': ['error', { maxArgs: 2 }],
      'jest/require-top-level-describe': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'jest/no-commented-out-tests': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      curly: ['warn', 'all'],
      eqeqeq: ['error', 'allow-null'],
      'spaced-comment': ['error', 'always'],
    },
  },

  // Unit tests — relaxed rules
  {
    files: ['**/*.{spec,test}.{ts,tsx}', '**/tests/**'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  // Libraries — stricter rules
  {
    files: ['libs/**'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  },

  // JS files — allow require, no return type
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  // Prettier must be last
  eslintConfigPrettier,
];

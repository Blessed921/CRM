import js from '@eslint/js';

export default [
  { ignores: ['dist', 'node_modules', '**/*.ts', '**/*.tsx'] },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
  },
];

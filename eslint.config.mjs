import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    languageOptions: {
      globals: { 
        ...globals.browser, 
        ...globals.node 
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      // Next.js specific rules - disable React import requirement
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      // Override problematic rules
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': ['error', { ignore: ['tw'] }],
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'warn',
      // Disable Next.js rules that aren't available
      '@next/next/no-img-element': 'off',
    },
  },
  eslintPluginPrettierRecommended,
  {
    // Ignore certain files that might cause issues
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      '.env',
      'dist/**',
      'build/**',
      '.cloudflare/**',
      'functions/**',
      'pages/**',
      'public/**',
      '*.config.js',
      '*.config.mjs',
    ],
  },
];

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: [
      './tsconfig.json',
      './tsconfig.node.json',
      './packages/logic-core/tsconfig.json',
      './packages/logic-core/tsconfig.node.json',
    ],
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [
          'tsconfig.json',
          'tsconfig.node.json',
          './packages/logic-core/tsconfig.json',
          './packages/logic-core/tsconfig.node.json',
        ],
      },
    },
  },
  plugins: ['react', '@typescript-eslint', 'import', 'prettier', 'react-hooks'],
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:import/recommended',
    'standard',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-void': 'off',
    'import/named': 'off',
    'import/default': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/class-literal-property-style': 'off',
    '@typescript-eslint/no-wrapper-object-types': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-unused-expressions': [
      'error',
      { ignoreDirectives: true },
    ],
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/unified-signatures': 'off',
    '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      { allowNumber: true, allowBoolean: true },
    ],
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: {
          arguments: false,
          attributes: false,
        },
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-anonymous-default-export': [
      'error',
      {
        allowNew: true,
      },
    ],
    'import/no-unresolved': ['error', { ignore: ['^virtual:'] }],
    '@typescript-eslint/only-throw-error': 'off',
    '@typescript-eslint/unbound-method': 'off',
    'react/prop-types': 'off',
  },
};

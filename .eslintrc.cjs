module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'jsx-quotes': ['error', 'prefer-double'],
  },
  overrides: [
    {
      files: ['tools/**/*.{cjs,js,ts}'],
      env: { node: true },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['**/*.{spec,test}.{j,t}s?(x)'],
      env: { node: true, jest: true },
    },
  ],
};

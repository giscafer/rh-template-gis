module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    eqeqeq: 0,
    'react/no-children-prop': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-unused-expressions': 0,
    'no-async-promise-executor': 0,
    '@typescript-eslint/no-use-before-define': 0,
  },
};

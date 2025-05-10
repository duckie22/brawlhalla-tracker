module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module", // Recognize ES Modules
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};

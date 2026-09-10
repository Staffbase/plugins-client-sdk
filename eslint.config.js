const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const globals = require("globals");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.extends("eslint:recommended", "plugin:prettier/recommended"),
  {
    languageOptions: {
      ecmaVersion: 8,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        ...globals.mocha,
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["test/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];

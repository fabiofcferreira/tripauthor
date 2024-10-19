const eslint = require("@eslint/js");
const tselint = require("typescript-eslint");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  {
    files: ["./src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      ...eslint.configs.recommended.rules,
      ...tselint.configs.recommended,
      ...eslintConfigPrettier.rules,
    },
  },
];

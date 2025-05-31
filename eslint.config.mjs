import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      quotes: ["error", "double"],
      semi: ["error", "always"],
      eqeqeq: ["error", "always"],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "consistent-return": "error",
      "prefer-const": "error",
      "no-var": "error",
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-undef": "error",
    }
  },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  { files: ["**/*.jsonc"], plugins: { json }, language: "json/jsonc", extends: ["json/recommended"] },
  { files: ["**/*.json5"], plugins: { json }, language: "json/json5", extends: ["json/recommended"] },
]);

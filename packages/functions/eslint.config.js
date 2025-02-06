import importPlugin from "eslint-plugin-import";
import js from "eslint-plugin-import";
import tseslint from "typescript-eslint";
import google from "eslint-config-google";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  eslintPluginPrettierRecommended,
  importPlugin.flatConfigs.recommended,
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, google],
    root: true,
    env: {
      es6: true,
      node: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: ["tsconfig.json", "tsconfig.dev.json"],
      sourceType: "module",
    },
    ignores: ["/lib/**/*", "/generated/**/*"],
  },
);
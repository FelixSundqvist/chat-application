import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import importPlugin from "eslint-plugin-import";
// eslint-disable-next-line import/no-unresolved
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslintPluginPrettierRecommended,
  importPlugin.flatConfigs.recommended,
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [["@/*", "./src/*"]],
        },
        node: {},
        typescript: {},
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // Cross-feature imports are forbidden
            {
              target: "./src/features/chat",
              from: "./src/features",
              except: ["./chat"],
            },
            {
              target: "./src/features/sign-in",
              from: "./src/features",
              except: ["./sign-in"],
            },
            // Shared code can't import from features or app
            {
              target: [
                "./src/components",
                "./src/hooks",
                "./src/lib",
                "./src/types",
                "./src/utils",
              ],
              from: ["./src/features", "./src/app"],
            },
          ],
        },
      ],
    },
  },
);

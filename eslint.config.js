import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import importPlugin from "eslint-plugin-import";
// eslint-disable-next-line import/no-unresolved
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslintPluginPrettierRecommended,
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // functions can't import from frontend
            {
              target: "./packages/functions",
              from: "./packages/frontend",
            },
          ],
        },
      ],
    },
  },
);

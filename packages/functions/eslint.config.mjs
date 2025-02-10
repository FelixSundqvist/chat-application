import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(eslintPluginPrettierRecommended, {
  extends: [...tseslint.configs.recommended],
  plugins: {},
  ignores: ["dist", "lib"],
  files: ["src/**/*.{ts}"],
});

import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: {
      react: { version: "18.3" },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        alias: {
          map: [
            ["@", "./src"],
            ["@components", "./src/components"],
            ["@pages", "./src/pages"],
            ["@hooks", "./src/hooks"],
            ["@layouts", "./src/layouts"],
            ["@utils", "./src/utils"],
            ["@services", "./src/services"],
            ["@features", "./src/features"],
            ["@store", "./src/store"],
            ["@assets", "./src/assets"],
            ["@styles", "./src/assets/styles"],
          ],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    plugins: ["import", "react", "react-hooks", "react-refresh"],
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];

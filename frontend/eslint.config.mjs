import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Custom rules for production-grade code
  {
    rules: {
      // React hooks rules - critical for performance
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // General JavaScript
      "no-console": "off",
      "no-debugger": "warn",

      // Code quality
      "prefer-const": "warn",
      "no-var": "warn",
      eqeqeq: "warn",

      // TypeScript
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",

      // React
      "react/no-unescaped-entities": "off",
    },
  },
  // Override default ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
])

export default eslintConfig

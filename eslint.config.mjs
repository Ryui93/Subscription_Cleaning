import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "backup-untracked/**",
      "marketing/**",
      "articles/**",
      "*.html",
      "app.js",
      "sw.js",
      "tests/**"
    ]
  },
  ...nextVitals,
  ...nextTypescript
];

export default eslintConfig;

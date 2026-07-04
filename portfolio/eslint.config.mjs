import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next uses the legacy eslintrc format; FlatCompat bridges it
// into the new flat config system (eslint >= 9).
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;

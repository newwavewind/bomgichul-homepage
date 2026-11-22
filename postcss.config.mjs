import { fileURLToPath } from "node:url";

const readingScalePlugin = fileURLToPath(new URL("./scripts/postcss-reading-scale.cjs", import.meta.url));

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    [readingScalePlugin]: {},
  },
};

export default config;

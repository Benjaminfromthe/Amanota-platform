/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Tailwind CSS v4 uses its own PostCSS plugin to handle @theme, @import "tailwindcss", etc.
    "@tailwindcss/postcss": {},
  },
};

export default config;

const path = require('path');
const pages = path.resolve(__dirname, './src/pages/**/*.{js,ts,jsx,tsx}');
const layouts = path.resolve(__dirname, './src/layouts/**/*.{js,ts,jsx,tsx}');
const components = path.resolve(
  __dirname,
  './src/components/**/*.{js,ts,jsx,tsx}'
);
module.exports = {
  important: true,
  purge: [layouts, pages, components],
};

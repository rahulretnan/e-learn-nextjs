const path = require('path');
const tailwindConfig = path.resolve(__dirname, './tailwind.config.js');
module.exports = {
  plugins: {
    tailwindcss: { config: tailwindConfig },
    autoprefixer: {},
  },
};

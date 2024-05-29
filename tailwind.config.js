/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Signika-Regular", ...defaultTheme.fontFamily.sans],
      myBold: ['"Baloo2"'],
      myRegular: ["Inter"],
      myThin: ["Quicksand"],
      "signika-l": ["Signika-Light"]
    },
    extend: {}
  },
  plugins: []
});

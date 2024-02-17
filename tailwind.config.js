/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        antonio: ["Antonio", "sans-serif"],
      },
      colors: {
        "dark-seagreen": "#A5C39A",
        "main-seagreen": "#AAD9BB",
        "dark-turqoise": "#80BCBD",
        "light-green": "#E0FFED",
        "semi-green": "#57BA81",
        "dark-green": "#3C5B2B",
        "light-gray-green": "#D2EEDC",
        "main-green": "#01913E",
        "main-gray": "#E2E2E2",
        "dark-gray": "#474747",
        "main-yellow": "#FFCF40",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
});

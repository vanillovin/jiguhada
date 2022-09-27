/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        notoSans: ['Noto Sans KR', 'sans-serif'],
      },
      colors: {
        'jghd-blue': '#4D96FF',
        'jghd-green': '#6BCB77',
        'jghd-red': '#ff8787',
        'gray-1': '#fcfcfc',
        'gray-2': '#f2f2f2',
        'gray-3': '#adadad',
        'gray-4': '#686868',
        'gray-5': '#3d3d3d',
      },
      screens: {
        mobile: '375px',
        tablet: '768px',
      },
    },
  },
  plugins: [require('daisyui')],
};

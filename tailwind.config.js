/** @type {import('tailwindcss').Config} */
export default {
  content: [ './entrypoints/popup/*.{html,js,ts,tsx}'],
  theme: {
    extend: {
      colors:{
        'container_bg_color': '#581845',
        'faint_blue': '#0A66C2'
      },
      width:{
        'w-500': '500px'
      }
    },
  },
  plugins: [],
}


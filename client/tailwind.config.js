/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors: {
        'tf-orange':'#F08149',
        'tf-orange-dark':'#A35832',
        'tf-red':'#BD3B3B',
        'tf-red-dark':'#802828',
        'tf-red-dark2':'#4A1B1B',
        'tf-blue':'#395C78',
        'tf-blue-dark':'#273E51',
        'tf-blue-dark2':'#1B2731'
       }
    },
    fontFamily: {
      mont: ['Montserrat', 'sans-serif']
    }
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0A0A0A',
        bg2:     '#0F0F0F',
        text:    '#E8E8E8',
        text2:   '#6B6B6B',
        text3:   '#3A3A3A',
        border:  '#1E1E1E',
        border2: '#2A2A2A',
        green:   '#3ecf8e',
        amber:   '#F5A623',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        runde: ['"Open Runde"', '"Open Runde Placeholder"', 'sans-serif'], // Added custom font configuration
      },
      fontSize: {
        '2xs': '10px',
        xs:    '11px',
        sm:    '12px',
        base:  '13px',
      },
      maxWidth: {
        page: '640px',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s forwards',
        'fade-in': 'fadeIn 0.5s forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
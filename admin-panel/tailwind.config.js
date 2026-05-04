/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E11D48',
        surface: '#FFFFFF',
        background: '#F8FAFC',
        border: '#E2E8F0',
        'text-main': '#111827',
        'text-muted': '#64748B',
        'accent-success': '#10B981',
        'accent-warning': '#F59E0B',
        'accent-error': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'primary-glow': '0 0 20px rgba(225, 29, 72, 0.15)',
      },
    },
  },
  plugins: [],
}

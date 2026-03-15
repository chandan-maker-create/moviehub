/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: '#E50914', // Netflix red
        'primary-hover': '#F40612',
        dark: {
          100: '#0A0A0A', // Deeper black background
          200: '#151515', // Slightly lighter for cards
          300: '#202020',
        },
        accent: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          pink: '#ec4899',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0) 100%)',
      }
    },
  },
  plugins: [],
}

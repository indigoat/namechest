import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#f7f7fb',
          surface: '#ffffff',
          fg: '#0b0d13',
          muted: '#5d6476',
          border: '#d7dbe6',
          accent: '#4f46e5',
          accent2: '#06b6d4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        brand: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 1px 0 rgba(15, 23, 42, 0.04), 0 12px 40px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
} satisfies Config

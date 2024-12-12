module.exports = {
  content: ['./components/**/*.js', './pages/**/*.js','./pages/**/*.mdx', './_projects/*.mdx'],
  plugins: [
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss')
  ],
  theme: {
    extend: {
      fontFamily: {
        'release': ['var(--font-noto)', 'sans-serif'],
        'sans': ['var(--font-noto)', 'sans-serif'],
      },
      boxShadow: {
        'inner-xl': 'inset 0 4px 8px 0 rgb(0 0 0 / 0.5)',
      },
      keyframes: {
        spinScaled: {
          '0%': { transform: 'rotate(0deg) scale(2)' },
          '50%': { transform: 'rotate(180deg) scale(2)' },
          '100%': { transform: 'rotate(360deg) scale(2)' },
        }
      },
      animation: {
        'spin-stars': 'spinScaled 60s linear infinite',
      }
    }
  }
}

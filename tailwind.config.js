/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary: deep, slightly blue-leaning green
        leaf: {
          50: '#effaf6',
          100: '#d7f2e7',
          200: '#b0e5d1',
          300: '#7bd0b4',
          400: '#45b494',
          500: '#22997a',
          600: '#137b63',
          700: '#0f6251',
          800: '#104e42',
          900: '#0e4038',
          950: '#042420',
        },
        // Secondary: lighter mint/teal for accents and glows
        mint: {
          100: '#e4fbf1',
          200: '#bdf5dd',
          300: '#8bead0',
          400: '#54d7b4',
          500: '#2dbd9a',
        },
        // Warm neutral: sand / beige surfaces
        sand: {
          50: '#faf8f4',
          100: '#f4f0e8',
          200: '#e9e2d4',
          300: '#dbd0bb',
          400: '#c4b598',
          500: '#a99678',
        },
        // Text + dark surfaces
        ink: {
          400: '#7c8a86',
          500: '#5b6864',
          600: '#414c49',
          700: '#2b3432',
          800: '#1c2422',
          900: '#111716',
        },
        clay: '#c2703f', // single warm accent for badges / sale flags
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16, 78, 66, 0.04), 0 8px 24px -12px rgba(16, 78, 66, 0.18)',
        lift: '0 18px 40px -18px rgba(16, 78, 66, 0.35)',
        glow: '0 0 0 1px rgba(45, 189, 154, 0.25), 0 20px 50px -20px rgba(34, 153, 122, 0.45)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(250,248,244,1) 100%)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(0,-18px,0) scale(1.04)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        drift: 'drift 14s ease-in-out infinite',
        'drift-slow': 'drift 22s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};

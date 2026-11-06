/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0B1120',
          sidebar: '#101827',
          card: '#182536',
          hover: '#1E2D44',
          input: '#0F1A2C',
        },
        accent: {
          primary: '#B8F34A',
          primaryDark: '#9BD12E',
          secondary: '#7C83FF',
          secondaryDark: '#5B63E0',
        },
        ink: {
          primary: '#F5F7FA',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        line: '#27384F',
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F87171',
        info: '#60A5FA',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.18)',
        card: '0 1px 3px rgba(0,0,0,0.3), 0 8px 28px rgba(0,0,0,0.22)',
        glow: '0 0 0 1px rgba(184,243,74,0.15), 0 8px 30px rgba(184,243,74,0.12)',
        glowSec: '0 0 0 1px rgba(124,131,255,0.18), 0 8px 30px rgba(124,131,255,0.15)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(184,243,74,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(184,243,74,0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out both',
        slideIn: 'slideIn 0.3s ease-out both',
        scaleIn: 'scaleIn 0.3s ease-out both',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};

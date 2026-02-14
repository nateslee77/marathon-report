import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          base: '#0a0a0a',
          rail: '#0e0e0e',
          elevated: '#111111',
          surface: '#181818',
          card: '#131313',
        },
        border: {
          subtle: '#1a1a1a',
          DEFAULT: '#222222',
          strong: '#333333',
        },
        text: {
          primary: '#e5e5e5',
          secondary: '#a1a1a1',
          tertiary: '#555555',
        },
        accent: {
          primary: '#c2ff0b',
          'primary-dim': 'rgba(194, 255, 11, 0.08)',
          danger: '#ff4444',
          warning: '#ffaa00',
          info: '#4488ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        'xs': ['0.6875rem', { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0.05em' }],
        'sm': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
        'base': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'lg': ['1.125rem', { lineHeight: '1.4', fontWeight: '500' }],
        'xl': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        '2xl': ['1.5rem', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.01em' }],
        '3xl': ['2rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        '4xl': ['2.5rem', { lineHeight: '1.05', fontWeight: '700', letterSpacing: '-0.03em' }],
        'stat': ['1.75rem', { lineHeight: '1', fontWeight: '600', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '4px',
        md: '4px',
        lg: '6px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(0, 0, 0, 0.4)',
        DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.5)',
        strong: '0 4px 12px rgba(0, 0, 0, 0.6)',
        'card': 'inset 0 1px 0 rgba(255, 255, 255, 0.03), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.4)',
        'card-hover': 'inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.5)',
        'card-accent': 'inset 0 1px 0 rgba(194, 255, 11, 0.04), 0 0 20px rgba(194, 255, 11, 0.03), 0 4px 12px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 30px rgba(194, 255, 11, 0.06)',
      },
      width: {
        'rail': '340px',
      },
      spacing: {
        'rail': '340px',
      },
      keyframes: {
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-down': 'slide-down 150ms ease-out',
        'fade-in': 'fade-in 200ms ease-out',
      },
    },
  },
  plugins: [],
};

export default config;

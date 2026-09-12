/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'hsl(var(--canvas) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        ink: 'hsl(var(--ink) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        line: 'hsl(var(--line) / <alpha-value>)',
        navy: 'hsl(var(--navy) / <alpha-value>)',
        teal: 'hsl(var(--teal) / <alpha-value>)',
        benign: 'hsl(var(--benign) / <alpha-value>)',
        malignant: 'hsl(var(--malignant) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
        info: 'hsl(var(--info) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        tabular: ['"IBM Plex Sans"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        workstation: '80rem',
      },
      borderRadius: {
        card: '0.875rem',
      },
      boxShadow: {
        card: '0 1px 2px hsl(var(--navy) / 0.04), 0 8px 24px hsl(var(--navy) / 0.04)',
      },
      transitionDuration: {
        clinical: '200ms',
      },
    },
  },
  plugins: [],
};

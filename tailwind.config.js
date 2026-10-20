/** @type {import('tailwindcss').Config} */

// Every color is a CSS variable (see src/index.css) so both themes share one
// set of utilities and components never hardcode a theme-specific color.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        elevated: token('elevated'),
        ink: token('ink'),
        muted: token('muted'),
        subtle: token('subtle'),
        line: token('line'),
        accent: token('accent'),
        'accent-ink': token('accent-ink'),
        cta: token('cta'),
        success: token('success'),
        danger: token('danger'),
      },
      fontFamily: {
        // Apple system stack: SF Pro on Apple devices, Segoe UI on Windows.
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      fontSize: {
        display: ['clamp(2.75rem, 1.6rem + 4.6vw, 5.25rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        title: ['clamp(2rem, 1.35rem + 2.6vw, 3.5rem)', { lineHeight: '1.06', letterSpacing: '-0.03em' }],
        headline: ['clamp(1.375rem, 1.15rem + 0.9vw, 1.875rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        metric: ['clamp(2.25rem, 1.7rem + 2.2vw, 3.5rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],
        eyebrow: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.14em' }],
      },
      maxWidth: {
        shell: '72rem',
        prose: '38rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgb(var(--shadow) / 0.06), 0 8px 24px -12px rgb(var(--shadow) / 0.18)',
        lift: '0 1px 2px rgb(var(--shadow) / 0.08), 0 24px 48px -24px rgb(var(--shadow) / 0.35)',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}

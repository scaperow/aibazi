const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{html,js,vue, css,ts}'],
  theme: {
    extend: {
      colors: {
        // matel: 'oklch(var(--matel) / <alpha-value>)',
        // wood: 'oklch(var(--wood) / <alpha-value>)',
        // water: 'oklch(var(--water) / <alpha-value>)',
        // fire: 'oklch(var(--fire)/ <alpha-value>)',
        // earth: 'oklch(var(--earth) / <alpha-value>)'
        matel: colors.amber['500'],
        wood: colors.green['500'],
        water: colors.cyan['500'],
        fire: colors.red['500'],
        earth: colors.stone['500']
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      // cupcake theme
      {
        light: {
          ...require('daisyui/src/theming/themes')['winter'],
          '--matel': '83.69% 0.164 84.43',
          '--wood': '39.25% 0.09 152.54',
          '--water': '39.82% 0.066 227.39',
          '--fire': '39.58% 0.133 25.72',
          '--earth': '21.61% 0.006 56.04'
        }
      },
      // dark theme
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          '--primary-muted': '34% 0.2 289'
        }
      }
    ]
  }
}

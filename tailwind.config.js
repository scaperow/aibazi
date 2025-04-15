/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./public/index.html', './src/**/*.{html,js,ts,jsx,tsx,vue,css}'],
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
          fontSize: {
            sm: '0.4rem',
            base: '0.2rem',
            xl: '2.25rem',
            '2xl': '1.563rem',
            '3xl': '1.953rem',
            '4xl': '2.441rem',
            '5xl': '3.052rem',
          },
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
  },
  corePlugins: {
    // 小程序不需要 preflight，因为这主要是给 h5 的，如果你要同时开发多端，你应该使用 process.env.TARO_ENV 环境变量来控制它
    preflight: false
  }
}

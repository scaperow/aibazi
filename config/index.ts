import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import devConfig from './dev'
import prodConfig from './prod'
import NutUIResolver from '@nutui/auto-import-resolver'
import Components from 'unplugin-vue-components/webpack'
const { UnifiedWebpackPluginV5 } = require('weapp-tailwindcss/webpack')

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'webpack5'>(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport<'webpack5'> = {
    env: JSON.stringify(mode),
    projectName: 'aibazi-mini2',
    date: '2024-10-16',
    designWidth (input) {
      // 配置 NutUI 375 尺寸
      if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
        return 375
      }
      // 全局使用 Taro 默认的 750 尺寸
      return 750
    },
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ['@tarojs/plugin-html'],
    defineConstants: {
    },
    copy: {
      patterns: [
      ],
      options: {
      }
    },
    framework: 'vue3',
    compiler: {
      type: 'webpack5',
      prebundle: {
        enable: false
      }
    },
    cache: {
      enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: false,
          config: {

          }
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        },

      },
      webpackChain(chain) {
        chain.merge({
          plugin: {
            install: {
              plugin: UnifiedWebpackPluginV5,
              args: [{
                appType: 'taro',
                // 下面个配置，会开启 rem -> rpx 的转化
                rem2rpx: true
              }]
            }
          }
        })
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
        chain.resolve.plugin('MultiPlatformPlugin')
        .tap(args => {
           args[2]["include"] = ['@taro-mobile']
           return args
        })
        chain.plugin('unplugin-vue-components').use(Components({
          resolvers: [NutUIResolver({taro: true})]
        }))
      }
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js'
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
        chain.plugin('unplugin-vue-components').use(Components({
          resolvers: [NutUIResolver({taro: true})]
        }))
      }
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})

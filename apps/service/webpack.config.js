const CopyPlugin = require('copy-webpack-plugin')

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
/**
 * webpack配置
 * @param {*} options nest-cli中webpack默认配置
 * @returns
 */
module.exports = function (options) {
  // 添加打包分析插件
  // options.plugins.push(
  //   new BundleAnalyzerPlugin({
  //     analyzerPort: 8888,
  //   }),
  // )
  options.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: './templates',
          to: './templates',
        },
        {
          from: './.env.local',
          to: './',
        },
      ],
    }),
  )
  return {
    ...options,
  }
}

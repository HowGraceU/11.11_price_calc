const {
  resolve,
} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const argv = require('yargs-parser')(process.argv.slice(2));

const _mode = argv.mode || 'development';

module.exports = {
  entry: {
    index: resolve('src/index'),
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: resolve('.cache/.babel-loader'),
            },
          },
        ],
      }, {
        test: /\.(js|vue|ts|tsx|jsx)$/,
        enforce: 'pre', // 预先加载好 eslint loader
        exclude: /node_modules/, // 排除掉 node_modules 文件夹下的所有文件
        use: [{
          loader: 'eslint-loader',
          options: {
            formatter: eslintFriendlyFormatter,
            emitWarning: true,
          },
        }],
      }, {
        test: /\.css$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: resolve('.cache/.cache-loader'),
            },
          },
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // 开启 CSS Modules
              modules: {
                localIdentName: _mode === 'development' ? '[path][name]__[local]' : '[hash:base64:16]',
              },
              importLoaders: 1,
              sourceMap: _mode === 'development',
              localsConvention: 'camelCase',
            },
          },
          'postcss-loader',
          {
            loader: 'global-css-module-loader', // './config/loaders/global-css-module-loader.js'
            // 添加入全局的css url
            options: {
              globalCssPath: [
                resolve('node_modules'),
              ],
            },
          },
          'typed-css-modules-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('public/index.html'),
    }),
    // new BundleAnalyzerPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  resolveLoader: {
    modules: [
      'node_modules',
      resolve('loaders'),
    ],
  },
  devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    overlay: { // 当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
      errors: true,
    },
    inline: true,
    hot: true,
  },
};

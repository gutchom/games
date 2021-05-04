const path = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = {
  entry: {
    bundle: './src/script/index.tsx'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/js'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      component: path.resolve(__dirname, 'src/script/component'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [
          /node_modules/,
          /\.test\./
        ],
        use: [
          'babel-loader',
          'ts-loader',
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
  },
}

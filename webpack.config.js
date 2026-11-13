const path = require('path')

module.exports = {
  target: 'node',
  entry: 'src/index.ts',
  context: __dirname,
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    pathinfo: true,
    libraryTarget: 'umd',
    devtoolModuleFilenameTemplate: 'webpack-tabby-browser-cli:///[resource-path]',
  },
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  resolve: {
    modules: ['.', 'src', 'node_modules'].map(x => path.join(__dirname, x)),
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      { test: /\.ts$/, use: { loader: 'ts-loader' } },
    ],
  },
  externals: [
    'fs',
    'path',
    /^rxjs/,
    /^@angular/,
    /^@ng-bootstrap/,
    /^tabby-/,
  ],
}

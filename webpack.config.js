const path = require('path')


module.exports = {
  entry: './src/reader.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'reader.bundle.js',
    libraryTarget: 'umd',
    library: 'PassportReader',
    umdNamedDefine: true,
    libraryExport: 'default',
  },
  module: {
    rules: [{ test: /.ts$/, use: 'ts-loader' }],
  },
}

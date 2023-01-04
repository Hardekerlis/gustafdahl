const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'inline-source-map',
  target: 'node',
  entry: './src/app.ts',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    modules: [
      // path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, './'),
      'node_modules',
    ],
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      lib: path.resolve(__dirname, 'src/lib'),
      app: path.resolve(__dirname, 'src/app'),
    },
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts'],
    },
  },
  module: {
    rules: [
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.([cm]?ts|tsx)$/,
        loader: 'ts-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
};

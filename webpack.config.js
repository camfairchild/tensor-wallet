/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack")
const CopyPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const tsImportPluginFactory = require('ts-import-plugin');

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  devServer: {
    port: 3004,
    open: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
            plugins: [
              [
                'babel-plugin-direct-import',
                { modules: ['@mui/material', '@mui/icons-material', '@material-ui/core'] },
              ],
            ],
          },
        },
      },
      {
        test: /\.(tsx|ts)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [tsImportPluginFactory(/** options */)],
          }),
          compilerOptions: {
            module: 'es2022',
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      "react/jsx-runtime": require.resolve("react/jsx-runtime"),
    },
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  },
  plugins: [
    //new BundleAnalyzerPlugin(),
    new CopyPlugin({
      patterns: [{ from: "src/assets", to: "./assets" }],
    }),
    new CopyPlugin({
      patterns: [{ from: "public/CNAME", to: "./" }],
    }),
    new webpack.DefinePlugin({
      process: {
        env: {
          WS_URL: JSON.stringify(undefined),
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}

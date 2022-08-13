const HtmlWebPackPlugin = require("html-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { DuplicatesPlugin } = require("inspectpack/plugin");
const TerserPlugin = require("terser-webpack-plugin");

const webpack = require("webpack");

const smp = new SpeedMeasurePlugin();

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html",
});

var path = require("path");

module.exports = smp.wrap(
  merge(common, {
    devtool: "source-map",
    mode: "production",
    resolve: {
      extensions: [".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                sourceMap: false,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: false,
                sassOptions: {
                  outputStyle: "compressed",
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            sourceMap: true,
          },
        }),
      ],
    },
    // plugins: [htmlPlugin],
    plugins: [
      new DuplicatesPlugin({
        // Emit compilation warning or error? (Default: `false`)
        emitErrors: false,
        // Display full duplicates information? (Default: `false`)
        verbose: false,
      }),
    ],

    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production"),
          REACT_APP_PUBLIC_PATH: JSON.stringify("public"),
        },
      }),
    ],

    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      htmlPlugin,
      new DuplicatesPlugin({
        // Emit compilation warning or error? (Default: `false`)
        emitErrors: false,
        // Display full duplicates information? (Default: `false`)
        verbose: false,
      }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production"),
        },
      }),

      new webpack.optimize.AggressiveMergingPlugin(),
    ],
  })
);

const HtmlWebPackPlugin = require("html-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html",
});

var path = require("path");

module.exports = {
    entry: "./src/index.tsx",
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".scss"],
        modules: ["src", "node_modules"], // Assuming that your files are inside the src dir
    },
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                },
            },
            //   {
            //     test: /\.s[ac]ss$/i,
            //     use: [
            //       "style-loader",
            //       {
            //         loader: "css-loader",
            //         options: {
            //           sourceMap: true,
            //         },
            //       },
            //       {
            //         loader: "sass-loader",
            //         options: {
            //           sourceMap: true,
            //           // sassOptions: {
            //           //   outputStyle: "compressed",
            //           // },
            //         },
            //       },
            //     ],
            //   },
        ],
    },
    plugins: [htmlPlugin],

    // plugins: [
    //   htmlPlugin,
    //   new webpack.DefinePlugin({ //<--key to reduce React's size
    //     'process.env': {
    //       'NODE_ENV': JSON.stringify('production')
    //     }
    //   }),
    //   new webpack.optimize.DedupePlugin(),
    //   new webpack.optimize.UglifyJsPlugin(),
    //   new webpack.optimize.AggressiveMergingPlugin(),
    //   // new CompressionPlugin({
    //   //   asset: "[path].gz[query]",
    //   //   algorithm: "gzip",
    //   //   test: /\.js$|\.css$|\.html$/,
    //   //   threshold: 10240,
    //   //   minRatio: 0.8
    //   // })
    // ],
};

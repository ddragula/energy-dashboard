const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        static: {
            directory: path.resolve(__dirname, '../public'),
            publicPath: './',
            watch: true
        },
        devMiddleware: {
            writeToDisk: true,
        },
        port: 3000,
        open: true
    },
    optimization: {
        runtimeChunk: 'single',
    },
    output: {
        filename: '[name].[contenthash].js'
    },
});

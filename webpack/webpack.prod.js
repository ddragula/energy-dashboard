const ESLintPlugin = require('eslint-webpack-plugin');
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new ESLintPlugin({
            extensions: ['ts'],
            failOnError: false,
            failOnWarning: false
        }),
    ],
    output: {
        filename: '[name].min.js',
    },
});

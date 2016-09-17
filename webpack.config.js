const webpack = require('webpack')

module.exports = {
    entry: {
        index     : './src/js/index.js',
    },
    output: {
        path: __dirname,
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.less$/,
                loader: 'style!css!less',
            },
            {
                test: /\.css$/,
                loader: 'style!css',
            },
            {
                test: /\.vue$/,
                loader: 'vue',
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}

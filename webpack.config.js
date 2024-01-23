const webpack = require('webpack');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH });


module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        sw: './src/sw.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [{
            test: /\.(css|scss)$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: function () {
                            return [
                                require('autoprefixer')
                            ];
                        }
                    }
                }
            }, {
                loader: 'sass-loader'
            }]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: true
        }),
        new CopyPlugin({
            patterns: [{
                from: './src/manifest.json',
                to: ''
            }, {
                from: './src/img/favicon.ico',
                to: 'img/'
            }, {
                from: './src/img/cacti-96.png',
                to: 'img/'
            }, {
                from: './src/img/cacti-192.png',
                to: 'img/'
            }, {
                from: './src/img/cacti-512.png',
                to: 'img/'
            }, {
                from: './src/img/cacti-1024.png',
                to: 'img/'
            }],
        }),
        new webpack.DefinePlugin({
            URL_ROOT: JSON.stringify(process.env.URL_ROOT),
            URL_API: JSON.stringify(process.env.URL_API),
            PUSH_APP_PUBLIC_KEY: JSON.stringify(process.env.PUSH_APP_PUBLIC_KEY),
        }),
        new AssetsPlugin({
            filename: 'assets.json',
            fullPath: false
        }),
    ],
    devServer: {
        static: './dist',
        hot: true,
    },
    devtool: 'inline-source-map',

}
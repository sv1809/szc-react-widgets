var webpack = require('webpack');
var path = require('path');
var config = require('../config');
var utils = require('./utils');
var projectRoot = path.resolve(__dirname, '../');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {        
        styles: './assets/styles/index.less'
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: config.build.assetsPublicPath,
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'components': path.resolve(__dirname, '../src/components')
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/},
            // {test: /\.less$/, loader: ExtractTextPlugin.extract("css?sourceMap!postcss!less?sourceMap"), exclude: /node_modules/},
            // {test: /\.css$/, loader: ExtractTextPlugin.extract("style!css?sourceMap!postcss"), exclude: /node_modules/},
            { test: /\.json$/, loader: 'json' },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.otf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/vnd.ms-fontobject" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
            { test: /\.(png|jpe?g|gif)(\?.*)?$/, loader: 'file?name=img/[name].[ext]' }
        ]
    },
    postcss: function () {
        return [precss, autoprefixer];
    },
    plugins: [
        new CleanWebpackPlugin(config.build.assetsRoot, { root: path.resolve(__dirname, '..') }),
        new ExtractTextPlugin(`styles/[name].css`, { allChunks: true, publicPath: '../' }),
    ]
}

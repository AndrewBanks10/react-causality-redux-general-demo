// webpack.config.js
var path = require('path');
var webpack = require('webpack');
var ClosureCompilerPlugin = require('webpack-closure-compiler');

var theModule = {
    loaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015','react']
            }
        }
    ]
};

var app =   [
            path.join(__dirname, 'src/state-partitions/partitions.js'),
            path.join(__dirname, 'src/business-logic/business.js'),
            path.join(__dirname, 'src/before-react-components/run.js'),
            path.join(__dirname, 'src/react-components/react-components.js'),
            ]

var configApp = {
    entry: {
        app: app
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: theModule,
    devServer: {
        contentBase: path.resolve(__dirname, './'),
    },
}

var configAppMin = {
    entry: {
        app: app
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: theModule,
    devServer: {
        contentBase: path.resolve(__dirname, './'),
    },
    plugins: [
        new ClosureCompilerPlugin({
            compiler: {
                language_in: "ECMASCRIPT5",
                language_out: "ECMASCRIPT5",
                compilation_level: "SIMPLE"
            },
        })
    ]
}

if ( process.env.NODE_ENV == 'production' ) {
    module.exports = [
        configAppMin
    ];
} else {
    module.exports = [
        configApp
    ];
}



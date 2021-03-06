const {version} = require('./package');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const pkg = require('./package');
const path = require('path');

module.exports = {
    mode: 'production',
    target: 'node',

    entry: {
        'cli.js': './src/index.ts'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    output: {
        filename: '[name]',
        path: `${__dirname}/lib`
    },

    externals: {
        glob: 'require("glob")',
        chalk: 'require("chalk")',
        chokidar: 'require("chokidar")',
        commander: 'require("commander")'
    },

    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    'ts-loader',
                    'eslint-loader'
                ]
            }
        ]
    },

    plugins: [
        new webpack.BannerPlugin({
            banner: `Bavary CLI ${version} MIT | https://github.com/Simonwep/bavary-cli`
        }),

        new webpack.DefinePlugin({
            VERSION: JSON.stringify(pkg.version)
        })
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                sourceMap: false,
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true,
                    mangle: false,
                    compress: false,
                    output: {
                        beautify: true
                    }
                }
            })
        ]
    }
};


var path = require('path');
var webpack = require('webpack');
var argv = require('minimist')(process.argv.slice(2));

var DEBUG = !argv.release,
    AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
        '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
        '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';

module.exports = {
    entry: './app/client/app.js',
    output: {
        path: './build/',
        publicPath: '/',
        sourcePrefix: '  ',
        filename: 'app.js'
    },
    cache: DEBUG,
    debug: DEBUG,

    stats: {
        colors: true,
        reasons: DEBUG
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules|bower_components/,
                loader: 'eslint-loader'
            }
        ],

        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules|bower_components/
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.(png|jpg|gif)$/  ,
                loader: 'file-loader?name=images/[name].[ext]'
            }, 	// inline base64 URLs for <=8k images, direct URLs for the rest
            {
                test: /\.html/,
                loader: 'raw'
            },
            {
                test: /\.jade$/,
                loader: "jade"
            }
        ]
    },
    resolve: {
        alias: {
          lodash: path.resolve( __dirname, './bower_components/lodash/lodash.js'),
          later: path.resolve( __dirname, './node_modules/later')
        }
    },
    plugins: {
        $push: [
            new webpack.ProvidePlugin({
                _: "lodash",
                later: "later"
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
                '__DEV__': DEBUG
            }),
            new webpack.optimize.DedupePlugin()
        ].concat(
            DEBUG ? [] : [
                new webpack.optimize.UglifyJsPlugin({
                    minimize: true,
                    compress: {
                        warnings: true
                    }
                }),
                new webpack.optimize.AggressiveMergingPlugin()
            ]
        )
    }
};

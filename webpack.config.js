const webpack = require('webpack');
const Uglify = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const extractCSS = new MiniCssExtractPlugin({
    filename: "css/[name].css"
});

module.exports = (env) => {
    const isDevBuild = !(env && env.production);
    return {
        devtool: 'source-map',
        entry: {
            main: __dirname + '/src/index.ts',
            test: __dirname + '/src/specs.js',
        },
        output: {
            filename: isDevBuild ? "[name].js" : "[name].min.js",
            path: __dirname + '/dist',
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".jsx"],
            alias: {
                mocks: `${__dirname}/src/_mocks/`,
            }
        },
        plugins: isDevBuild ? [extractCSS] : [
            extractCSS,
            new Uglify({
                sourceMap: true,
                uglifyOptions: {
                    ecma: 6,
                    compress: true
                }
            }),
            new webpack.DefinePlugin({
               'process.env.NODE_ENV': JSON.stringify('production')
            })
        ],
        stats: { children: false },
        module: {
            rules: [
                {
                    // Typescript files, which will get converted
                    // to JavaScript files based on tsconfig.json,
                    // then converted by babel like regular JS
                    test: /\.(ts|tsx)$/,
                    exclude: [/node_modules/],
                    use: [
                        // convert JSX, es6
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: './build/.babelCache',
                            }
                        },
                        // convert typescript to js
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                "useBabel": true,
                                "babelCore": "@babel/core",
                            }
                        }
                    ]
                },
                {
                    // JavaScript files, which will be transpiled
                    // based on .babelrc
                    test: /\.(js|jsx)$/,
                    exclude: [/node_modules/],
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: './build/.babelCache',
                        }
                    }] // convert JSX, es6
                },
                {
                    test: /\.(js|jsx)$/,
                    use: ['source-map-loader'],
                    enforce: 'pre',
                    exclude: /node_modules/
                },
                {
                    // SASS files run through Sass-processor
                    // before generic CSS loader
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                              hmr: isDevBuild,
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: !isDevBuild,
                            }
                        },   // translates CSS into CommonJS
                        { loader: 'sass-loader' }   // compiles Sass to CSS
                    ],
                },
            ]
        },
    };
};

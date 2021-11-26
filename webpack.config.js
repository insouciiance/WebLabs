const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './Lab3/Frontend/src/index.jsx',
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, './Lab3/Frontend/dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './Lab3/Frontend/src/index.html',
            favicon: './Lab3/Frontend/src/favicon.png',
        }),
    ],
    resolve: {
        modules: [__dirname, 'src', 'node_modules'],
        extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: require.resolve('babel-loader'),
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName:
                                    '[name]__[local]___[hash:base64:5]',
                            },
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.png|svg|jpg|gif$/,
                use: ['file-loader'],
            },
        ],
    },
    devServer: {
        historyApiFallback: true,
    },
};

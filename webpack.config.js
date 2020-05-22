const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    watch: true,
    entry: {
        index: './src/scripts/main.js'
    },
    mode: 'development',
    devServer: {
        open: true,
        //contentBase: path.join(__dirname, 'dist')
        publicPath: '/dist/',
        writeToDisk: true //avoir le dossier 'dist' sur l'ordinateur        
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, './src/template_index.html'),
            chunks: ['index']
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',            
        })
    ],
    module: {
        rules: [
            /*{
                test: /\.css$/,
                use: ["style-loader", "css-loader"] //il faut d'abord que le css-loader se declenche, puis style-loader, mais l'ordre est inverse, donc style-loader est a placer en premier
            },*/
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.(obj|mtl|jpg|png)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "3dmodel"
                    }
                }
            },
            {
                test: /\.(png)$/,
                loader: 'url-loader'
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        
                    },
                    'css-loader'],

            }
        ]
    }
};
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // https://github.com/jantimon/html-webpack-plugin

module.exports = ({mode}) => {
    console.log(mode)
    return {
        mode,
        entry: {
            'app': `${__dirname}/src/index.js`,
        },

        // ファイルの出力設定
        output: {
            path: path.resolve(__dirname, './dist'),
            assetModuleFilename: 'assets/[name][ext]',
            filename: '[name].js',
            clean: false,
        },
        module: {
            rules: [
                {
                    test: /\.html$/i,
                    loader: "html-loader",
                    options: {
                        minimize: false,
                    },
                },

                // 画像ファイルの設定
                {
                    test: /\.(png|jpe?g|gif|svg|woff2?|ttf|ept)$/,
                    type: 'asset',
                    generator: {
                        filename: 'assets/[path][name][ext]'
                    },
                    parser: {
                        dataUrlCondition: {
                            maxSize: 4 * 1024, // 4kb以上は埋め込まずにファイルとして分離
                        },
                    }
                },
                // シェーダー読み込み
                {
                    test: /\.(vs|fs|glsl|vert|frag)$/,
                    type: 'asset/resource'
                },
            ]
        },
        resolve: {
            alias: {
                '@scss': path.join(__dirname, 'src/glsl'),
                '@images': path.join(__dirname, 'src/images')
            },
            // importする際の拡張子を省略できる。
            // import '@scss/app.scss' → '@scss/app'
            extensions: ['.js', '.glsl'],
            modules: [path.join(__dirname, 'src'), 'node_modules']
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: `${__dirname}/src/index.html`,
                // favicon: `${__dirname}/images/meta/favicon.ico`,
                minify: false
            }),
        ],
        devtool: 'source-map', // 分割
        devServer: {
            port: 8080,
            host: '0.0.0.0',
        },
    }
};
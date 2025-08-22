import path, {dirname} from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);

export default {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(dirname(__filename), "dist"),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: "./src/index.html",
            }
        ),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.html$/i,
                use: ["html-loader"],
            },
            {
                test: /\.(png|svg|gif|jpg|jpeg)$/i,
                type: "resource/asset",
            },
        ],
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
};
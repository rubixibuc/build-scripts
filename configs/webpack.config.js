const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = (
  { port },
  {
    alias = {},
    background = "#000",
    exposes = {},
    links = [],
    logo = require.resolve("../assets/logo.png"),
    name = "myapp",
    shared = {},
    theme_color = "#fff",
    title = "My App",
  }
) => ({
  devServer: {
    port,
    static: path.join(__dirname, "dist"),
  },
  entry: "./src/index",
  mode: "development",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/i,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "css-loader",
            options: {
              exportType: "css-style-sheet",
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["postcss-preset-env", "autoprefixer"],
              },
            },
          },
        ],
      },
    ],
  },
  output: {
    assetModuleFilename: "[name].[contenthash][ext][query]",
    clean: true,
    filename: "[name].[contenthash].js",
    publicPath: "auto",
  },
  plugins: [
    new ModuleFederationPlugin({
      exposes,
      filename: "remoteEntry.js",
      name,
      shared,
    }),
    new ExternalTemplateRemotesPlugin(),
    new HtmlWebpackPlugin({
      title,
    }),
    new HtmlWebpackTagsPlugin({
      links,
    }),
    new FaviconsWebpackPlugin({
      favicons: {
        background,
        theme_color,
      },
      logo,
      prefix: "[contenthash]/",
    }),
  ],
  resolve: {
    alias,
  },
});

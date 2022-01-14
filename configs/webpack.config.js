const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const InjectBodyPlugin = require("inject-body-webpack-plugin").default;

module.exports = ({
  background,
  exposes,
  links = [],
  logo = require.resolve("../assets/logo.png"),
  metas,
  port,
  remotes,
  scripts = [],
  shared,
  themeColor,
  title = "My App",
  varName = "myapp",
} = {}) => ({
  devServer: {
    allowedHosts: [".loca.lt", ".ngrok.io"],
    historyApiFallback: true,
    port,
  },
  entry: [require.resolve("regenerator-runtime/runtime"), "./src/index"],
  mode: "development",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/i,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [require.resolve("@babel/preset-env")],
          },
        },
      },
      {
        resourceQuery: /^\?data/,
        type: "asset/inline",
      },
      {
        resourceQuery: /^\?file/,
        type: "asset/resource",
      },
      {
        resourceQuery: /^\?source/,
        type: "asset/source",
      },
      {
        oneOf: [
          {
            resourceQuery: /^\?string/,
            use: [
              {
                loader: require.resolve("css-loader"),
                options: {
                  exportType: "string",
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve("postcss-loader"),
                options: {
                  postcssOptions: {
                    plugins: [
                      require.resolve("postcss-preset-env"),
                      require.resolve("autoprefixer"),
                    ],
                  },
                },
              },
            ],
          },
          {
            resourceQuery: /^\?style/,
            use: [
              require.resolve("style-loader"),
              {
                loader: require.resolve("css-loader"),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve("postcss-loader"),
                options: {
                  postcssOptions: {
                    plugins: [
                      require.resolve("postcss-preset-env"),
                      require.resolve("autoprefixer"),
                    ],
                  },
                },
              },
            ],
          },
          {
            use: [
              {
                loader: require.resolve("css-loader"),
                options: {
                  exportType: "css-style-sheet",
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve("postcss-loader"),
                options: {
                  postcssOptions: {
                    plugins: [
                      require.resolve("postcss-preset-env"),
                      require.resolve("autoprefixer"),
                    ],
                  },
                },
              },
            ],
          },
        ],
        test: /\.css$/i,
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
      name: varName,
      remotes,
      shared,
    }),
    new ExternalTemplateRemotesPlugin(),
    new HtmlWebpackPlugin({
      title,
    }),
    new HtmlWebpackTagsPlugin({
      links,
      metas,
      scripts,
    }),
    new FaviconsWebpackPlugin({
      favicons: {
        background,
        theme_color: themeColor,
      },
      logo,
      prefix: "[contenthash]/",
    }),
    new InjectBodyPlugin({
      content: '<div id="root" style="display: contents;"></div>',
    }),
  ],
  resolve: {
    modules: [path.resolve("src"), "node_modules"],
  },
});

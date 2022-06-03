const path = require("path");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const { ModuleFederationPlugin } = require("webpack").container;
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const InjectBodyPlugin = require("inject-body-webpack-plugin").default;
const WebpackObfuscator = require("webpack-obfuscator");

module.exports = ({
  background,
  exposes,
  links = [],
  logo = require.resolve("../logo.png"),
  metas,
  obfuscator,
  polyfill = "entry",
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
  entry: [
    polyfill === "entry" && require.resolve("../polyfill.js"),
    require.resolve("../index.js"),
  ].filter(Boolean),
  mode: "development",
  module: {
    rules: [
      {
        rules: [
          obfuscator && {
            loader: WebpackObfuscator.loader,
            options: {
              ...obfuscator,
              ignoreImports: true,
            },
          },
          {
            exclude: /node_modules\/(?!@rubixibuc\/build-scripts)/,
            loader: require.resolve("babel-loader"),
            options: {
              presets: [require.resolve("@babel/preset-env")],
            },
          },
          {
            exclude: /node_modules/,
            loader: require.resolve("babel-loader"),
            options: {
              presets: [require.resolve("@babel/preset-react")],
            },
            test: /\.jsx$/i,
          },
        ].filter(Boolean),
        test: /\.([tj])sx?$/i,
      },
      {
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
        options: {
          presets: [require.resolve("@babel/preset-typescript")],
        },
        test: /\.ts$/i,
      },
      {
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
        options: {
          presets: [
            [
              require.resolve("@babel/preset-typescript"),
              {
                allExtensions: true,
                isTSX: true,
              },
            ],
          ],
        },
        test: /\.tsx$/i,
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
        rules: [
          {
            oneOf: [
              {
                loader: require.resolve("css-loader"),
                options: {
                  exportType: "string",
                  importLoaders: 1,
                },
                resourceQuery: /^\?string/,
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
                ],
              },
              {
                loader: require.resolve("css-loader"),
                options: {
                  exportType: "css-style-sheet",
                  importLoaders: 1,
                },
              },
            ],
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
        test: /\.css$/i,
      },
    ].filter(Boolean),
  },
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ["imagemin-webp"],
            },
            preset: "webp",
          },
        ],
      }),
    ],
  },
  output: {
    assetModuleFilename: "[name].[contenthash][ext][query]",
    clean: true,
    filename: "[name].[contenthash].js",
    publicPath: "auto",
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process",
    }),
    new Dotenv({
      expand: true,
      systemvars: true,
    }),
    new ModuleFederationPlugin({
      exposes,
      name: varName,
      remotes,
      shared,
    }),
    new ExternalTemplateRemotesPlugin(),
    new HtmlWebpackPlugin({
      base: "/",
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
    fallback: {
      assert: require.resolve("assert"),
      buffer: require.resolve("buffer"),
      console: require.resolve("console-browserify"),
      constants: require.resolve("constants-browserify"),
      crypto: require.resolve("crypto-browserify"),
      domain: require.resolve("domain-browser"),
      events: require.resolve("events"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      path: require.resolve("path-browserify"),
      process: require.resolve("process/browser"),
      punycode: require.resolve("punycode"),
      querystring: require.resolve("querystring-es3"),
      stream: require.resolve("stream-browserify"),
      string_decoder: require.resolve("string_decoder"),
      sys: require.resolve("util"),
      timers: require.resolve("timers-browserify"),
      tty: require.resolve("tty-browserify"),
      url: require.resolve("url"),
      util: require.resolve("util"),
      vm: require.resolve("vm-browserify"),
      zlib: require.resolve("browserify-zlib"),
    },
    modules: [path.resolve("src"), "node_modules"],
  },
});

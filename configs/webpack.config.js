const path = require("path");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const deps = require("../package.json").dependencies;
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
  entry: require.resolve("../index.js"),
  mode: "development",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/i,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              [
                require.resolve("@babel/preset-env"),
                {
                  corejs: 3,
                  useBuiltIns: "usage",
                },
              ],
            ],
          },
        },
      },
      obfuscator && {
        enforce: "post",
        test: /\.js$/i,
        use: {
          loader: WebpackObfuscator.loader,
          options: {
            ...obfuscator,
            ignoreImports: true,
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
      process: "process/browser",
    }),
    new Dotenv({
      expand: true,
      systemvars: true,
    }),
    new ModuleFederationPlugin({
      exposes,
      filename: "remoteEntry.js",
      name: varName,
      remotes,
      shared: {
        ...Object.entries({
          assert: { requiredVersion: deps["assert"] },
          buffer: { requiredVersion: deps["buffer"] },
          console: { requiredVersion: deps["console-browserify"] },
          constants: { requiredVersion: deps["constants-browserify"] },
          "core-js/": { requiredVersion: deps["core-js"] },
          crypto: { requiredVersion: deps["crypto-browserify"] },
          domain: { requiredVersion: deps["domain-browser"] },
          events: { requiredVersion: deps["events"] },
          http: { requiredVersion: deps["stream-http"] },
          https: { requiredVersion: deps["https-browserify"] },
          os: { requiredVersion: deps["os-browserify"] },
          path: { requiredVersion: deps["path-browserify"] },
          process: { requiredVersion: deps["process"] },
          punycode: { requiredVersion: deps["punycode"] },
          querystring: { requiredVersion: deps["querystring-es3"] },
          stream: { requiredVersion: deps["stream-browserify"] },
          string_decoder: { requiredVersion: deps["string_decoder"] },
          sys: { requiredVersion: deps["util"] },
          timers: { requiredVersion: deps["timers-browserify"] },
          tty: { requiredVersion: deps["tty-browserify"] },
          url: { requiredVersion: deps["url"] },
          util: { requiredVersion: deps["util"] },
          vm: { requiredVersion: deps["vm-browserify"] },
          zlib: { requiredVersion: deps["browserify-zlib"] },
        }).reduce(
          (shared, [module, options]) => ({
            ...shared,
            [module]: { ...options, singleton: true },
          }),
          {}
        ),
        ...shared,
      },
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

const path = require("path");
const fs = require("fs");
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
  polyfill = { browser: true, component: true },
  port,
  preboot = ["txs", "ts", "jsx", "js"].some((extension) =>
    fs.existsSync(path.resolve("src", "preboot." + extension))
  ),
  remotes,
  scripts = [],
  shared,
  tailwindcss,
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
    polyfill && polyfill.browser && require.resolve("../polyfill/browser"),
    polyfill && polyfill.component && require.resolve("../polyfill/component"),
    preboot && path.resolve("src/preboot"),
    require.resolve("../index"),
  ].filter(Boolean),
  mode: "development",
  module: {
    rules: [
      {
        exclude: /node_modules\/(?!@rubixibuc\/build-scripts)/,
        rules: [
          obfuscator && {
            loader: WebpackObfuscator.loader,
            options: {
              ...obfuscator,
              ignoreImports: true,
            },
          },
          {
            use: ({ realResource }) => [
              {
                loader: require.resolve("babel-loader"),
                options: {
                  presets: [
                    require.resolve("@babel/preset-env"),
                    /\.jsx$/i.test(realResource) &&
                      require.resolve("@babel/preset-react"),
                    /\.ts$/i.test(realResource) &&
                      require.resolve("@babel/preset-typescript"),
                    /\.tsx$/i.test(realResource) && [
                      require.resolve("@babel/preset-typescript"),
                      {
                        allExtensions: true,
                        isTSX: true,
                      },
                    ],
                  ].filter(Boolean),
                },
              },
            ],
          },
        ].filter(Boolean),
        test: /\.([tj])sx?$/i,
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
                  tailwindcss && [
                    require.resolve("tailwindcss"),
                    {
                      ...tailwindcss,
                      content: ["./src/**/*.{js,jsx,ts,tsx}"],
                      prefix: varName + "-",
                    },
                  ],
                  require.resolve("autoprefixer"),
                ].filter(Boolean),
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
      filename: "remoteEntry.js",
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
    extensions: [".tsx", ".ts", "jsx", "..."],
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      console: require.resolve("console-browserify"),
      constants: require.resolve("constants-browserify"),
      crypto: require.resolve("crypto-browserify"),
      domain: require.resolve("domain-browser"),
      events: require.resolve("events/"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      path: require.resolve("path-browserify"),
      process: require.resolve("process/browser"),
      punycode: require.resolve("punycode/"),
      querystring: require.resolve("querystring-es3"),
      stream: require.resolve("stream-browserify"),
      string_decoder: require.resolve("string_decoder/"),
      sys: require.resolve("util/"),
      timers: require.resolve("timers-browserify"),
      tty: require.resolve("tty-browserify"),
      url: require.resolve("url/"),
      util: require.resolve("util/"),
      vm: require.resolve("vm-browserify"),
      zlib: require.resolve("browserify-zlib"),
    },
    modules: [path.resolve("src"), "node_modules"],
  },
});

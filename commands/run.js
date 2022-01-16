module.exports = async (options) => {
  const { cosmiconfig } = require("cosmiconfig");

  const explorer = cosmiconfig("build-scripts");
  const config = await explorer.search();

  const webpackConfig = require("../configs/webpack.config")({
    ...(config && config.config),
    ...options,
  });

  const Webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");

  const compiler = Webpack({ ...webpackConfig, devtool: "source-map" });
  const devServerOptions = { ...webpackConfig.devServer, open: true };
  const server = new WebpackDevServer(devServerOptions, compiler);

  await server.start();
};

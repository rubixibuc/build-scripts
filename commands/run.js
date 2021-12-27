module.exports = async (options) => {
  const { cosmiconfig } = require("cosmiconfig");
  const explorer = cosmiconfig("scripts");

  const config = await explorer.search();

  const Webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");
  const webpackConfig = require("../configs/webpack.config");

  const compiler = Webpack(webpackConfig({ ...options }, { ...config }));
  const devServerOptions = { ...webpackConfig.devServer, open: true };
  const server = new WebpackDevServer(devServerOptions, compiler);

  await server.start();
};

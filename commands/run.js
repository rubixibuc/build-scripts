module.exports = async ({ port }) => {
  const { cosmiconfig } = require("cosmiconfig");
  const explorer = cosmiconfig(require("../package.json").name);

  const config = await explorer.search();

  const Webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");
  const webpackConfig = require("../configs/webpack.config");

  const compiler = Webpack(webpackConfig(3000, { ...config }));
  const devServerOptions = { ...webpackConfig.devServer, open: true };
  const server = new WebpackDevServer(devServerOptions, compiler);

  server.start();
};

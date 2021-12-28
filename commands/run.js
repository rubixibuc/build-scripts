module.exports = async (options) => {
  const { cosmiconfig } = require("cosmiconfig");
  const explorer = cosmiconfig("build-scripts");

  const config = await explorer.search();

  const Webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");
  const webpackConfig = require("../configs/webpack.config")(
    { ...options },
    { ...(config && config.config) }
  );

  const compiler = Webpack(webpackConfig);
  const devServerOptions = { ...webpackConfig.devServer, open: true };
  const server = new WebpackDevServer(devServerOptions, compiler);

  await server.start();
};

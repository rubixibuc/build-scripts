module.exports = async (options) => {
  const { cosmiconfig } = require("cosmiconfig");
  const explorer = cosmiconfig("build-scripts");

  const config = await explorer.search();

  const Webpack = require("webpack");
  const webpackConfig = require("../configs/webpack.config");

  const compiler = Webpack({
    ...webpackConfig({ ...options }, { ...config.config }),
    mode: "production",
  });

  compiler.run((err, stats) => {
    if (err) {
      process.exitCode = 1;
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      process.exitCode = 1;
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }
  });
};

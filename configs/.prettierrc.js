const plugins = Object.keys(require("../package.json").dependencies)
  .filter((dependency) => dependency.startsWith("@prettier/plugin-"))
  .map((dependency) => require.resolve(dependency));

module.exports = {
  plugins,
};

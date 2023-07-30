module.exports = async (globs, options) => {
  const spawn = require("cross-spawn");

  const result = spawn.sync(
    "npx",
    [
      "--yes",
      `prettier@${require("../package.json").dependencies.prettier}`,
      ...(options.fix ? ["--write"] : []),
      "--config",
      __dirname + "/../configs/.prettierrc.js",
      ...globs,
    ],
    {
      stdio: "inherit",
    }
  );

  process.exitCode = result.status;
};

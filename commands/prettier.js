module.exports = async (globs, options) => {
  const spawn = require("cross-spawn");

  if (options.fix) {
    const result = spawn.sync(
      "npx",
      ["--no-install", "prettier", "--write", ...globs],
      {
        stdio: "inherit",
      }
    );

    process.exitCode = result.status;

    return;
  }

  const result = spawn.sync("npx", ["--no-install", "prettier", ...globs], {
    stdio: "inherit",
  });

  process.exitCode = result.status;
};

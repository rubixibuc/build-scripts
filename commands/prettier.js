module.exports = async (globs, options) => {
  const spawn = require("cross-spawn");

  if (options.fix) {
    spawn.sync("npx", ["--no-install", "prettier", "--write", ...globs], {
      stdio: "inherit",
    });
    return;
  }

  spawn.sync("npx", ["--no-install", "prettier", ...globs], {
    stdio: "inherit",
  });
};

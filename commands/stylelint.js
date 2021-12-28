module.exports = async (globs, options) => {
  const stylelint = require("stylelint");
  const config = require("../configs/.stylelintrc.json");

  const results = await stylelint.lint({
    ...options,
    config,
    files: globs,
    formatter: "verbose",
  });

  if (results.errored) {
    process.exitCode = 1;
  }

  if (
    results.maxWarningsExceeded &&
    results.maxWarningsExceeded.foundWarnings >
      results.maxWarningsExceeded.maxWarnings
  ) {
    process.exitCode = 1;
  }

  console.log(results.output);
};

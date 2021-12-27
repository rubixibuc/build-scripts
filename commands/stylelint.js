module.exports = async (globs, options) => {
  const stylelint = require("stylelint");
  const config = require("../configs/.stylelintrc.json");

  const results = await stylelint.lint({
    ...options,
    config,
    files: globs,
    formatter: "verbose",
  });

  console.log(results.output);
};

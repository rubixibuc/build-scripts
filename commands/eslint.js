module.exports = async (globs, options) => {
  const config = require("../configs/.eslintrc.json");
  const { ESLint } = require("eslint");

  const { maxWarnings, ...filteredOptions } = options;

  const eslint = new ESLint({ ...filteredOptions, overrideConfig: config });

  const results = await eslint.lintFiles(globs);

  if (options.fix) {
    await ESLint.outputFixes(results);
  }

  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  const filteredResults = ESLint.getErrorResults(results);
  if (filteredResults.some((lintResult) => !lintResult.fixableErrorCount)) {
    process.exitCode = 1;
  }

  if (
    maxWarnings &&
    results.reduce(
      (previousValue, currentValue) =>
        previousValue +
        (currentValue.warningCount - currentValue.fixableErrorCount),
      0
    ) > maxWarnings
  ) {
    process.exitCode = 1;
  }

  console.log(resultText);
};

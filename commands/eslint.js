module.exports = async (globs, options) => {
  const config = require("../configs/.eslintrc.json");
  const { ESLint } = require("eslint");

  const eslint = new ESLint({ ...options, overrideConfig: config });

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

  console.log(resultText);
};

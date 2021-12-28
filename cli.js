#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
program.version("0.0.0");

program.command("build").action(require("./commands/build"));

program
  .command("eslint")
  .option("-f, --fix", "try fix")
  .option("-c, --cache", "enable cache")
  .option("-mw, --max-warnings <max-warnings>", "set max warnings")
  .argument("<globs...>", "path globs")
  .action(require("./commands/eslint"));

program
  .command("prettier")
  .option("-f, --fix", "try fix")
  .argument("<globs...>", "path globs")
  .action(require("./commands/prettier"));

program
  .command("run")
  .option("-p, --port <port>", "port number", "3000")
  .action(require("./commands/run"));

program
  .command("stylelint")
  .option("-f, --fix", "try fix")
  .option("-cs, --custom-syntax <custom-syntax>", "use custom syntax")
  .option("-mw, --max-warnings <max-warnings>", "set max warnings")
  .argument("<globs...>", "path globs")
  .action(require("./commands/stylelint"));

program.parseAsync(process.argv);

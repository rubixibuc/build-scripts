#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
program.version("0.0.0");

program
  .command("eslint")
  .option("-f, --fix", "try fix")
  .argument("<globs...>", "path globs")
  .action(require("./commands/eslint"));

program
  .command("stylelint")
  .option("-f, --fix", "try fix")
  .option("-c, --custom-syntax <custom-syntax>", "use custom syntax")
  .argument("<globs...>", "path globs")
  .action(require("./commands/stylelint"));

program
  .command("prettier")
  .option("-f, --fix", "try fix")
  .argument("<globs...>", "path globs")
  .action(require("./commands/prettier"));

program
  .command("run")
  .option("-p, --port <port>", "port number", "3000")
  .action(require("./commands/run"));

program.command("build").action(require("./commands/build"));

program.parseAsync(process.argv);

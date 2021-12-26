#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
program.version("0.0.0");

program
  .command("run")
  .option("-p, --port <port>", "port number", "3000")
  .action(require("./commands/run"));

program.command("build").action(require("./commands/build"));

program.parseAsync(process.argv);

#!/usr/bin/env node

require('log-node')();

const program = require('commander');
const chalk = require('chalk');

const pkg = require('./package.json');
const { routegen } = require('./routegen');
const { checkgot } = require('./checkgot');
const { editpostman } = require('./editpostman');

const { log } = console;

let validCommand = false;

program.version(pkg.version)
  .option('-v --version', 'print version');

program
  .command('routegen')
  .option('-s, --swagger [swagger.json]', 'Specify swagger file name')
  .option('-o, --output [route file name]', 'Specify route file name')
  .action((cmd) => {
    validCommand = true;
    routegen(cmd.swagger, cmd.output);
  });

program
  .command('editpostman')
  .option('-i, --input [input test case file]', 'Specify input file name')
  .option('-o, --output [output file name]', 'Specify output file name')
  .action((cmd) => {
    validCommand = true;
    if (!cmd.input) {
      log(chalk.red('please specify input by --input'));
      process.exit(1);
    }
    if (!cmd.output) {
      log(chalk.red('please specify output by --output'));
      process.exit(1);
    }
    editpostman(cmd.input, cmd.output);
  });

program
  .command('checkgot')
  .action(() => {
    validCommand = true;
    checkgot();
  });
function displayUsage() {
  process.exit(1);
}

program.on('--help', displayUsage);

program.parse(process.argv);

if (!validCommand) {
  program.outputHelp();
}

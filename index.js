#!/usr/bin/env node

require('log-node')();

const program = require('commander');
const chalk = require('chalk');

const pkg = require('./package.json');
const { routegen } = require('./routegen');
const { checkgot } = require('./checkgot');
const { editpostman } = require('./editpostman');
const { getPaySlip } = require('./payslip');

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
  .command('payslip')
  .option('-u, --w3id [w3 id]', 'Specify your intranet id')
  .option('-p, --password [password]', 'Specify your password')
  .action(async (cmd) => {
    validCommand = true;
    if (!cmd.w3id) {
      log(chalk.red('please specify input by -u'));
      process.exit(1);
    }
    if (!cmd.password) {
      log(chalk.red('please specify output by -p'));
      process.exit(1);
    }
    await getPaySlip(cmd.w3id, cmd.password);
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

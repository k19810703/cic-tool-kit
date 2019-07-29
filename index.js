#!/usr/bin/env node

require('log-node')();

const program = require('commander');
const chalk = require('chalk');

const pkg = require('./package.json');
const { routegen } = require('./routegen');
const { editpostman } = require('./editpostman');
const { getPaySlip } = require('./payslip');
const { getPicDiff } = require('./comparePic');
const {
  listParams,
  updateParam,
  typeParam,
} = require('./robotfunc');
const { openilc } = require('./openilc');

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
  .command('listparam')
  .action(async () => {
    validCommand = true;
    listParams()
      .catch(() => log(chalk.red('出错咧')));
  });

program
  .command('ilc')
  .action(async () => {
    validCommand = true;
    openilc()
      .catch((error) => {
        log(chalk.red('出错咧'));
        console.error(error);
      });
  });

program
  .command('updateparam')
  .option('-k, --key [key]', 'Specify your param name')
  .option('-d, --value [value]', 'Specify your param value')
  .action(async (cmd) => {
    validCommand = true;
    if (!cmd.key || typeof cmd.key !== 'string') {
      log(chalk.red('please specify key by -k'));
      process.exit(1);
    }
    if (!cmd.value) {
      log(chalk.red('please specify value by -d'));
      process.exit(1);
    }
    updateParam(cmd.key, cmd.value)
      .catch(() => log(chalk.red('出错咧')));
  });

program
  .command('type')
  .option('-k, --key [key]', 'Specify your param to be typed')
  .action(async (cmd) => {
    validCommand = true;
    if (!cmd.key || typeof cmd.key !== 'string') {
      log(chalk.red('please specify key by -k'));
      process.exit(1);
    }
    typeParam(cmd.key)
      .catch(() => log(chalk.red('出错咧')));
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
    getPaySlip(cmd.w3id, cmd.password)
      .catch(() => log(chalk.red('出错咧')));
  });

program
  .command('comparePic')
  .option('-a, --pica [picturea]', 'Specify one of your pictures to be compared')
  .option('-b, --picb [pictureb]', 'Specify the other picture to be compared')
  .option('-o, --output [output file]', 'compare result')
  .action(async (cmd) => {
    validCommand = true;
    if (!cmd.pica) {
      log(chalk.red('please specify your picture by -a'));
      process.exit(1);
    }
    if (!cmd.picb) {
      log(chalk.red('please specify your picture by -b'));
      process.exit(1);
    }
    if (!cmd.output) {
      log(chalk.red('please specify output picture by -o'));
      process.exit(1);
    }
    getPicDiff(cmd.pica, cmd.picb, cmd.output)
      .catch(() => log(chalk.red('出错咧')));
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

function displayUsage() {
  process.exit(1);
}

program.on('--help', displayUsage);

program.parse(process.argv);

if (!validCommand) {
  program.outputHelp();
}

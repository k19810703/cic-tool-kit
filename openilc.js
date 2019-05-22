const open = require('open');
const robot = require('robotjs');
const inquirer = require('inquirer');
const jsonfile = require('jsonfile');
const chalk = require('chalk');
const os = require('os');

const { preProcess, paramfile, updateParam } = require('./robotfunc');

const { log } = console;

async function getPass() {
  const answers = await inquirer
    .prompt([
      {
        type: 'input',
        message: 'please input your w3id password',
        name: 'w3idpass',
      },
    ]);
  return answers.w3idpass;
}

async function openilc() {
  if (os.type() !== 'Darwin') {
    log(chalk.green('此功能仅适用于MAC'));
    process.exit(0);
  }
  log(chalk.green('处理开始，请勿移动鼠标和操作键盘'));
  await preProcess();
  const params = jsonfile.readFileSync(paramfile);
  if (!params.ilcpass) {
    log(chalk.green('未发现保存的密码'));
    params.ilcpass = await getPass();
    await updateParam('ilcpass', params.ilcpass);
  }
  log(chalk.green('打开ILC，8秒后输入密码'));
  await open('/Applications/ILC.app');
  setTimeout(async () => {
    robot.typeString(params.ilcpass);
    robot.keyTap('enter');
  }, 8000);
}

module.exports.openilc = openilc;

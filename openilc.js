/* eslint-disable no-await-in-loop */
const open = require('open');
const robot = require('robotjs');
const inquirer = require('inquirer');
const jsonfile = require('jsonfile');
const chalk = require('chalk');
const os = require('os');
const delay = require('delay');

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
  await delay(8000);
  robot.typeString(params.ilcpass);
  robot.keyTap('enter');
  await delay(8000);
  for (let i = 0; i < 20; i += 1) {
    robot.keyTap('tab');
    await delay(500);
  }
  for (let i = 0; i < 5; i += 1) {
    robot.keyTap('8');
    await delay(500);
    robot.keyTap('tab');
  }
  await delay(500);
  robot.keyTap('f6');
}

module.exports.openilc = openilc;

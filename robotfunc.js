const robot = require('robotjs');
const os = require('os');
const fs = require('fs');
const jsonfile = require('jsonfile');
const chalk = require('chalk');

const { log } = console;

const paramfile = `${os.homedir()}/ctkparams.json`;

async function preProcess() {
  const paramexist = fs.existsSync(paramfile);
  if (!paramexist) {
    jsonfile.writeFileSync(paramfile, {}, { spaces: 2, EOL: '\r\n' });
  }
}

async function listParams() {
  await preProcess();
  const params = jsonfile.readFileSync(paramfile);
  const fields = Object.keys(params);
  fields.forEach((field) => {
    log(chalk.green(`${field}=${params[field]}`));
  });
}

async function updateParam(key, value) {
  await preProcess();
  log(chalk.green(`添加${key}=${value}`));
  const params = jsonfile.readFileSync(paramfile);
  params[key] = value || '';
  await jsonfile.writeFileSync(paramfile, params, { spaces: 2, EOL: '\r\n' });
  await listParams();
}

async function typeParam(key) {
  const params = jsonfile.readFileSync(paramfile);
  if (!params[key]) {
    log(chalk.red(`${key}不存在`));
  } else {
    log(chalk.green(`2秒后输入${key}的值，请切换到需要输入的窗口并把光标放置到需要输入的地方`));
    setTimeout(() => {
      robot.typeString(params[key]);
    }, 2000);
  }
}

module.exports.typeParam = typeParam;
module.exports.listParams = listParams;
module.exports.updateParam = updateParam;

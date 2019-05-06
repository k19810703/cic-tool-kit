const puppeteer = require('puppeteer');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const open = require('open');

const { log } = console;

async function click(page, xpath) {
  await page.waitForXPath(xpath);
  await (await page.$x(xpath))[0].click();
}

async function hover(page, xpath) {
  await page.waitForXPath(xpath);
  const object = (await page.$x(xpath))[0];
  await object.hover();
}

async function getOTP() {
  const answers = await inquirer
    .prompt([
      {
        type: 'input',
        message: 'Check your email and input one time password',
        name: 'otp',
      },
    ]);
  return answers.otp;
}

async function getPaySlip(userid, password) {
  log(chalk.green('w3贼慢，请耐心等待'));
  const browser = await puppeteer.launch(
    {
      headless: true,
      ignoreHTTPSErrors: true,
      args: [
        '--start-maximized',
      ],
      slowMo: 30,
    },
  );
  const page = (await browser.pages())[0];
  await page.goto('https://wd5.myworkday.com/ibm/d/home.htmld');
  const userNameXpath = '//*[@id="desktop"]';
  const passWordXpath = '//*[@id="body"]/div[1]/div[2]/div/div/form/input[4]';
  await page.waitForXPath(userNameXpath);
  await (await page.$x(userNameXpath))[0].type(userid);
  await (await page.$x(passWordXpath))[0].type(password);
  const loginXpath = '//*[@id="btn_signin"]';
  await (await page.$x(loginXpath))[0].click();
  log(chalk.green(`登录${userid}`));
  const appearedelement = await Promise.race([
    page.waitForXPath('//*[@id="errorDiv"]/p'),
    page.waitForXPath('//*[@data-automation-id="tdWidget"]/div[2]/button'),
  ]);
  const errormessage = await appearedelement.$x('//*[@id="errorDiv"]/p');
  if (errormessage.length > 0) {
    log(chalk.red('老哥，用户名或密码不对。'));
    await browser.close();
    process.exit(1);
  }
  log(chalk.green('欧了,接下来会再workday一顿操作，比较慢'));
  await click(page, '//*[@data-automation-id="tdWidget"]/div[2]/button');
  await click(page, '//*/button[@data-automation-id="Current_User"]');
  await click(page, '//*/div[@data-automation-id="hammy_profile_link"]');
  await click(page, '//*/button[@data-automation-id="relatedActionsButton"]');
  await hover(page, '//*/div[@data-automation-label="Employee"]');
  await click(page, '//*/div[@data-automation-label="Compensation Statements"]');
  log(chalk.green('打开工资单页面'));
  await page.goto('https://ibm.biz/payslipLite');
  await click(page, '//*[@id="page-content-wrapper"]/div/div/table/tbody[2]/tr[1]/td[2]/a');
  log(chalk.green('打开最近一个工资单'));
  await page.setRequestInterception(true);
  page.on('requestfinished', async (request) => {
    const requesturl = request.url();
    if (requesturl.endsWith('statement')) {
      const resonse = await request.response();
      const data = await resonse.buffer();
      await browser.close();
      fs.writeFile('payslip.pdf', data, (err) => {
        if (err) throw err;
        open('payslip.pdf');
        log(chalk.green('工资单保存=>payslip.pdf'));
      });
    }
  });
}

module.exports.getPaySlip = getPaySlip;

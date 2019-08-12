const puppeteer = require('puppeteer');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const open = require('open');
const jsonfile = require('jsonfile');
// const ProgressBar = require('progress');

const { paramfile } = require('./robotfunc');

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

async function getPaySlip() {
  const params = jsonfile.readFileSync(paramfile);
  if (!params.w3id) {
    log(chalk.red('w3id未设置。请用[updateparam -k w3id -d <your w3id>]来设置'));
    process.exit(1);
  }
  if (!params.pass) {
    log(chalk.red('w3id密码未设置。请用[updateparam -k pass -d <your w3id password>]来设置'));
    process.exit(1);
  }
  const userid = params.w3id;
  const password = params.pass;
  log(chalk.green('w3贼慢，请耐心等待'));
  const browser = await puppeteer.launch(
    {
      headless: false,
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
  // log(chalk.green(`登录${userid}`));
  log('出现OTP画面或者登陆成功');
  // 等待 密码错 OTP 登陆成功 出现
  const appearedelement = await Promise.race([
    page.waitForXPath('//*[@id="errorDiv"]/p'),
    page.waitForXPath('//*[@id="emailOTP"]'),
    page.waitForXPath('//*[@data-automation-id="tdWidget"]/div[2]/button'),
  ]);
  const errormessage = await appearedelement.$x('//*[@id="errorDiv"]/p');
  if (errormessage.length > 0) {
    log(chalk.red('老哥，用户名或密码不对。'));
    await browser.close();
    process.exit(1);
  }
  // const appearedelement2 = await Promise.race([
  //   page.waitForXPath('//*[@id="emailOTP"]'),
  //   page.waitForXPath('//*[@data-automation-id="tdWidget"]/div[2]/button'),
  // ]);
  const otpinput = await appearedelement.$x('//*[@id="emailOTP"]');
  if (otpinput.length > 0) {
    log(chalk.green('似乎需要one time password'));
    click(page, '//*[@id="emailOTP"]');
    log(chalk.green('passcode会发送到你邮箱，注意查收'));
    const passcode = await getOTP();
    const inputOTPXpath = '//*[@id="otppswd"]';
    await page.waitForXPath(inputOTPXpath);
    await (await page.$x(inputOTPXpath))[0].type(passcode);
    click(page, '//*[@id="btn_submit"]');
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
        log(chalk.green('工资单保存=>payslip.pdf,正在为您打开'));
        open('payslip.pdf');
      });
    }
  });
}

module.exports.getPaySlip = getPaySlip;

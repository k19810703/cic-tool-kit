const puppeteer = require('puppeteer');
const inquirer = require('inquirer');

const { log } = console;
const chalk = require('chalk');

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

const launchConfig = {
  ignoreHTTPSErrors: true,
  headless: false,
  args: [
    // '--start-fullscreen',
    '--ignore-certificate-errors',
    '--ignore-certificate-errors-spki-list',
  ],
  slowMo: 30,
  defaultViewport: null,
  // defaultViewport: {
  //   width: 1920,
  //   height: 3000,
  // },
};

async function submitNove(username, pass) {
  console.log(username, pass);
  const browser = await puppeteer.launch(launchConfig);
  const page = await browser.newPage();
  await page.goto('https://studio7.dalian.cn.ibm.com:9090/web/');
  const uname = await page.waitForXPath('//*[@id="desktop"]');
  await uname.type(username);
  const passObj = await page.waitForXPath('//*[@id="body"]/div[1]/div[2]/div/div/form/input[4]');
  await passObj.type(pass);
  const submitBtn = await page.waitForXPath('//*[@id="btn_signin"]');
  await submitBtn.click();
  const appearedelement = await Promise.race([
    page.waitForXPath('//*[@id="errorDiv"]/p'),
    page.waitForXPath('//*[@id="emailOTP"]'),
    page.waitForXPath('//*[@id="app"]/section/header/section/h1', {
      timeout: 60000,
    }),
  ]);

  const errormessage = await appearedelement.$x('//*[@id="errorDiv"]/p');
  if (errormessage.length > 0) {
    log(chalk.red('老哥，用户名或密码不对。'));
    await browser.close();
    process.exit(1);
  }

  const otpinput = await appearedelement.$x('//*[@id="emailOTP"]');
  if (otpinput.length > 0) {
    log(chalk.green('似乎需要one time password'));
    const emailOTP = await page.waitForXPath('//*[@id="emailOTP"]');
    await emailOTP.click();
    log(chalk.green('passcode会发送到你邮箱，注意查收'));
    const passcode = await getOTP();
    const inputOTPXpath = await page.waitForXPath('//*[@id="otppswd"]');
    await inputOTPXpath.type(passcode);
    const subOtp = await page.waitForXPath('//*[@id="btn_submit"]');
    await subOtp.click();
  };
  await page.evaluate(() => window.scrollTo(0, 4000));
  const subBtn = await page.waitForXPath('//*[@id="app"]/section/main/section/div/div[2]/div[2]/div/div[4]/button');
  await subBtn.click();
  const updatedTS = await page.waitForXPath('//*[@id="app"]/section/main/section/div/div/div[1]/h2');
  const text = await page.evaluate(targetObject => targetObject.textContent, updatedTS);
  log(chalk.green(text));

  await page.close();
  await browser.close();
}

module.exports.submitNove = submitNove;


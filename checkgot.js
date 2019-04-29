/* eslint-disable no-await-in-loop */

const puppeteer = require('puppeteer');
const chalk = require('chalk');

const { log } = console;

async function checkgot() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://rrys2019.com/');
  const xpath = '/html/body/div[5]/dl[1]/dt/h2';
  await page.waitForXPath(xpath);
  const title = await page.$x(xpath);
  const text = await page.evaluate(targetObject => targetObject.textContent, title[0]);
  log(chalk.white('目前最新', text));
  const titlexpath = '/html/body/div[5]/dl[1]/dd/p';
  await page.waitForXPath(titlexpath);
  const downloadtitles = await page.$x('/html/body/div[5]/dl[1]/dd/p');
  const downloadlinks = await page.$x('/html/body/div[5]/dl[1]/dd/div/a');
  for (let i = 0; i < downloadtitles.length; i += 1) {
    const downloadtitle = await page.evaluate(
      targetObject => targetObject.textContent, downloadtitles[i],
    );
    log(chalk.green(downloadtitle));
    const downloadlink = await page.evaluate(targetObject => targetObject.href, downloadlinks[i]);
    log(chalk.blue(downloadlink));
  }
  await browser.close();
}

module.exports.checkgot = checkgot;

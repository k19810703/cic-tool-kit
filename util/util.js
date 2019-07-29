/* eslint-disable no-await-in-loop */

const fs = require('fs');
const activeWin = require('active-win');
const delay = require('delay');

// const { log } = require('./log');

function readJsonFile(filepath) {
  // log.debug('readJsonFile', filepath);
  const filecontent = fs.readFileSync(filepath, 'utf-8');
  // log.debug('filecontent', filecontent);
  const jsondata = JSON.parse(filecontent);
  // log.debug('jsondata', JSON.stringify(jsondata));
  return jsondata;
}

async function getCurrentTitle() {
  const crtWin = await activeWin();
  let crtTitle = '';
  if (crtWin) {
    crtTitle = crtWin.title;
  } else {
    crtTitle = '';
  }
  return crtTitle;
}

async function waitForTitle(title, max) {
  let crtTitle = '';
  const maxtry = 20 || max;
  let retry = 1;
  while (crtTitle.indexOf(title) < 0) {
    await delay(1000);
    crtTitle = await getCurrentTitle();
    crtTitle = crtTitle || '';
    retry += 1;
    if (retry > maxtry) {
      throw new Error('未能等到ilc窗口出现');
    }
  }
  await delay(1000);
}

module.exports.readJsonFile = readJsonFile;
module.exports.getCurrentTitle = getCurrentTitle;
module.exports.waitForTitle = waitForTitle;

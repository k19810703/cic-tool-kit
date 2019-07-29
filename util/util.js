const fs = require('fs');
const activeWin = require('active-win');

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
  console.log(crtWin);
  if (crtWin) {
    crtTitle = crtWin.title;
  } else {
    crtTitle = '';
  }
  return crtTitle;
}

module.exports.readJsonFile = readJsonFile;
module.exports.getCurrentTitle = getCurrentTitle;

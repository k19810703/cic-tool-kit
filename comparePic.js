const compareImages = require('resemblejs/compareImages');
const fs = require('fs');
const chalk = require('chalk');
const { log } = console;

async function getPicDiff(p1, p2, output) {
  const options = {
    output: {
      errorColor: {
        red: 255,
        green: 0,
        blue: 255,
      },
      errorType: 'movement',
      transparency: 0.3,
      largeImageThreshold: 1200,
      useCrossOrigin: false,
      outputDiff: true,
    },
    scaleToSameSize: true,
    ignore: 'antialiasing',
  };

  const data = await compareImages(
    await fs.readFileSync(p1),
    await fs.readFileSync(p2),
    options,
  );
  if (data.rawMisMatchPercentage > 0) {
    log(chalk.red('图片不一致'));
    log(chalk.red(`不一致比例:${data.misMatchPercentage}%`));
    log(chalk.red(`不一致区域:${JSON.stringify(data.diffBounds)}%`));
  } else {
    log(chalk.red('图片一致'));
  }
  await fs.writeFileSync(output, data.getBuffer());
}

module.exports.getPicDiff = getPicDiff;

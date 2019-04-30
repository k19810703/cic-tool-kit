const jsonfile = require('jsonfile');
const chalk = require('chalk');

const { log } = console;

const has = Object.prototype.hasOwnProperty;

function replacesrc(pitem) {
  pitem.forEach((subitem) => {
    if (subitem.item) {
      replacesrc(subitem.item);
    }
    const { request } = subitem;
    if (request && has.call(request, 'body')) {
      const { body } = request;
      if (body && has.call(body, 'formdata')) {
        body.formdata.forEach((file) => {
          Object.defineProperty(file, 'src', { value: file.description });
        });
      }
    }
  });
}

function editpostman(input, output) {
  log(chalk.white(`${input} => ${output} complete`));
  jsonfile.readFile(input, (err, config) => {
    if (err) log(chalk.red(err));
    const { item } = config;
    replacesrc(item);
    jsonfile.writeFile(output, config, { spaces: 2, EOL: '\r\n' }, (writeerr) => {
      if (writeerr) log(chalk.red(err));
      log(chalk.white(`${input} => ${output} complete`));
    });
  });
}

module.exports.editpostman = editpostman;

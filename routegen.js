const log = require('log');
const chalk = require('chalk');
const fs = require('fs');
const jsonfile = require('jsonfile');

function routegen(swaggerfile, outputfile) {
  const targetSwaggerFile = swaggerfile || 'swagger.json';
  const paramexists = fs.existsSync(targetSwaggerFile);
  if (!paramexists) {
    log(chalk.redBright(`swagger file ${targetSwaggerFile} not found`));
    process.exit(1);
  }
  const swaggerdata = jsonfile.readFileSync(targetSwaggerFile);
  const paths = Object.keys(swaggerdata.paths);
  paths.forEach((path) => {
    console.log(path);
    const methods = Object.keys(swaggerdata.paths[path]);

    console.log(methods);
  })
}

module.exports.routegen = routegen;

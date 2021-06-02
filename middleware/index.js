const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname)
  .filter((filename) => filename !== 'index.js')
  .filter((filename) => path.extname(filename) === '.js');

for (let file of files) {
  module.exports[path.basename(file, '.js')] = require(`./${file}`);
}

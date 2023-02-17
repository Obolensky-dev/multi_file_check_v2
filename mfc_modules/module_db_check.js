var config  = require('./config-local-db-check.json');

var result = "Файл найден в базах модуля";
var report = "Ошибка проверки";
var status = "В процессе проверки";

var database = config.database;
var verbose = config.verbose

if (verbose) {
  console.log('database: ',database);
}


function isEmpty(value) {
  return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}


var check = function(pattern) {
  const fs = require('fs');
  if (verbose) {
    console.log('local-db-check: database=',database);
    console.log('local-db-check: pattern=',pattern);
  }

  status = "Проверка закончена";
  report = "Успешно";

  if (isEmpty(database)) {
    if (verbose) console.log('local-db-check: Empty database.');

    result = "Несоответствие";
    module.exports.result = result;
    module.exports.report = report;
    module.exports.status = status;
    return 100;
  }

  const fileContent = fs.readFileSync(database);
  const regex = new RegExp(pattern);
  if (fileContent.indexOf(pattern)>-1) {
    if (verbose) console.log(`Your pattern was found in file: ${database}`);
    result = "Файл найден в базах модуля";
    report = "Ошибка";
    module.exports.result = result;
    module.exports.report = report;
    module.exports.status = status;
    return 1;
  }

  result = "Файл не найден в базах модуля";

  module.exports.result = result;
  module.exports.report = report;
  module.exports.status = status;
  return 0;
};


module.exports.check =  check;
module.exports.result = result;
module.exports.status = status;
module.exports.report = report;


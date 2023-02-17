var config  = require('./config-clamav.json');
var fs = require('fs');

var scanner = config.scanner;
var parameters = config.parameters;
var param0 = config.param0;
var param1 = config.param1;
var param2 = config.param2;
var verbose = config.verbose

var final_code = 2;

var result = "Файл найден в базах модуля";
var report = "Ошибка проверки";
var status = "В процессе проверки";

if (verbose) {
  console.log('scanner: ',scanner);
  console.log('parameters: ',parameters);
  console.log('param1: ',param1);
}


var check = function(filename) {
  if (verbose) console.log('scan this file: ',filename);

  const { execFile } = require('child_process');

  const execFileSync = require('child_process').execFileSync;

  var str = param0;
  var words = str.split('=');
  var logfile = words[1];
  var value;
  if (verbose) console.log('logfile: ',logfile);
  fs.unlinkSync(logfile)

  try {
    //const stdout = execFileSync(scanner, [param0,param1,filename],{stdio:'inherit',stderr:'inherit'});
    const stdout = execFileSync(scanner, [param0,param1,filename]);
  }
  catch {
     if (verbose) console.log("WARNING: catch node.js wrong execFileSync() logic!!!");
  }

  var scan_ok = 0;
  var infected_flag = 0;

  var fileContent = fs.readFileSync(logfile).toString();
  //if (verbose) console.log(body);
  var lines = fileContent.split(/[\r\n]+/g);
  for(i=0;i<lines.length;i++) {
    //console.log(lines[i]);
    if (lines[i].indexOf('Scanned files:') > -1) {
      str = lines[i];
      if (verbose) console.log(str);
      words = str.split(':');
      value = words[1].trim();
      //value = words[1].replace(/ /g, '')
      //if (verbose) console.log('scanned: ',value);
      if (value > 0) {
        scan_ok = 1;
      }
    }
    if (lines[i].indexOf('Infected files:') > -1) {
      str = lines[i];
      if (verbose) console.log(str);
      words = str.split(':');
      value = words[1].trim();
      if (value > 0) {
        infected_flag = 1;
      }
    }
  }
  //infected_flag = 1;
  if (verbose) console.log('scan_ok: ',scan_ok);
  if (verbose) console.log('infected_flag: ',infected_flag);
  status = "Закончил";
  if (scan_ok) {
    report = "Проверено";
    result = "Файл не найден в базах модуля";
    final_code = 0;
    if (infected_flag) {
      result = "Файл найден в базах модуля";
      report = "Файл не найден в базах модуля";
      final_code = 1;
    }
  }

  module.exports.result = result;
  module.exports.report = report;
  module.exports.status = status;

  return final_code;
};


module.exports.check =  check;
module.exports.result = result;
module.exports.status = status;
module.exports.report = report;

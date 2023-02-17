var config  = require('./config-simpleav.json');
var fs = require('fs');
var path = require("path");

var scanner = config.scanner;
var database = config.database;
var parameters = config.parameters;
var param0 = config.param0;
var param1 = config.param1;
var param2 = config.param2;
var param3 = config.param3;
var param4 = config.param4;
var param5 = config.param5;
var param6 = config.param6;
var verbose = config.verbose
var scandir = config.scandir;

var final_code = 2;

var result = "Файл найден в базах модуля";
var report = "Ошибка проверки";
var status = "В процессе проверки";

if (verbose) {
  console.log('scanner: ',scanner);
  console.log('parameters: ',parameters);
  console.log('database: ',database);
  console.log('scandir: ',scandir);
}


var check = function(filename) {
  if (verbose) console.log('scan this file: ',filename);

  const { execFile } = require('child_process');

  const execFileSync = require('child_process').execFileSync;
  const execSync = require('child_process').execSync;

  var s = '-i ';
  var inc_opts = s + path.basename(filename) + ' ';
  s = '-c ';
  var db_opts = s + database + ' ';
  var my_params = scanner+" "+param0+" "+param1+" "+param2+" "+param3+" "+param4+" "+param5+" "+param6+" -i "+path.basename(filename)+" "+"-c "+database+" "+scandir;
  if (verbose) console.log(my_params);

  const stdout = execSync(my_params).toString();
  const out_results = stdout;
  console.log(out_results);

  //return 0;

  var scan_ok = 0;
  var infected_flag = 0;

  var lines = out_results.split(/[\r\n]+/g);
  for(i=0;i<lines.length;i++) {
    //console.log(lines[i]);
    if (lines[i].indexOf('Total found') > -1) {
      str = lines[i];
      if (verbose) console.log(str);
      var words = str.split(',');
      total = words[0];
      matched = words[1];
      if (verbose) console.log(total);
      if (verbose) console.log(matched);
      var res1 = total.replace(/\D/g,'');
      var res2 = matched.replace(/\D/g,'');
      if (verbose) console.log(res1);
      if (verbose) console.log(res2);
      if (res1 > 0) {
        scan_ok = 1;
        if (res2 > 0) infected_flag = 1;
      }
    }
  }
  //infected_flag = 1;
  if (verbose) console.log('scan_ok: ',scan_ok);
  if (verbose) console.log('infected_flag: ',infected_flag);
  status = "Закончил проверку";
  if (scan_ok) {
    report = "Проверено";
    result = "Файл не найден в базах модуля";
    final_code = 0;
    if (infected_flag) {
      result = "Файл найден в базах модуля";
      report = "Ошибка";
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

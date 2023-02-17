var config  = require('./config-virustotal.json');
var fs = require('fs');

var result = "Файл найден в базах модуля";
var report = "Ошибка проверки";
var status = "В процессе проверки";

var curl = config.curl;
var verbose = config.verbose;
var apikey = config.apikey;
var tempdir = config.tempdir;
var url = config.url;

if (verbose) {
  console.log('curl: ',curl);
  console.log('apikey: ',apikey);
  console.log('url: ',url);
  console.log('tempdir: ',tempdir);
}


function isEmpty(value) {
  return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}


var check = function(hashstr) {
  var final_code = 2;
  const fs = require('fs');
  if (verbose) {
    console.log('virustotal-check: hashstr=',hashstr);
  }

  status = "Закончил";
  result = "Несоответствие";

  if (isEmpty(hashstr)) {
    if (verbose) console.log('virustotal-check: Empty hash.');

    report = "Закончил проверку";

    module.exports.result = result;
    module.exports.report = report;
    module.exports.status = status;
    return final_code;
  }

  var outfile = tempdir+"\\"+"virustotal_answer.json";
  var my_params = curl+" -ssl "+url+" -d apikey="+apikey+" -d resource="+hashstr+" -o "+outfile;
  //fs.unlinkSync(outfile);
  if (verbose) console.log(my_params);

  const execSync = require('child_process').execSync;
  const stdout = execSync(my_params).toString();
  const out_results = stdout;
  if (verbose) console.log(out_results);

  if (verbose) console.log('virustotal-check: read answer file (JSON format).');
  var obj = JSON.parse(fs.readFileSync(outfile, 'utf8'));

  var total = obj.total;
  var positives = obj.positives;
  if (verbose) {
    console.log('total: ',total);
    console.log('positives: ',positives);
  }

  var scan_ok = 0;
  var infected_flag = 0;

  if (total > 0) {
        scan_ok = 1;
        report = "Закончил проверку";
        result = "Файл не найден в базах модуля";
        final_code = 0;
        if (positives > 0) {
          infected_flag = 1;
          result = "Файл найден в базах модуля";
          report = "Ошибка";
          final_code = 1;
        }
  }

  if (verbose) console.log('scan_ok: ',scan_ok);
  if (verbose) console.log('infected_flag: ',infected_flag);

  if (verbose) console.log('final_code: ',final_code);

  module.exports.result = result;
  module.exports.report = report;
  module.exports.status = status;
  return final_code;
};


module.exports.check =  check;
module.exports.result = result;
module.exports.status = status;
module.exports.report = report;


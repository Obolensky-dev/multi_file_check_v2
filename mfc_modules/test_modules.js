const filename = process.argv[2];
const fs = require('fs');

function usage() {
 console.log('Usage: node test_modules.js input-filename');
}

function isEmpty(value) {
  return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

if (isEmpty(filename)) {
 console.log('Empty input filename.');
 usage();
 return 1;
}

if (!fs.existsSync(filename)) {
    console.log('Input file NOT found.');
    return 2;
}

var module_check;
var module_status;
var module_result;
var module_report;

var verbose = 1;

function print_results() {
  if (verbose) {
    console.log(module_check);
    console.log(module_result);
    console.log(module_status);
    console.log(module_report);
  }
}

var module_file_hash = require('./module_file_hash');
var filehash = module_file_hash.filehash(filename);
var file_hash_md5 = module_file_hash.hash_md5;
var file_hash_sha1 = module_file_hash.hash_sha1;
var file_hash_sha256 = module_file_hash.hash_sha256;
var file_hash_sha512 = module_file_hash.hash_sha512;
if (verbose) {
  console.log('md5: ', file_hash_md5 );
  console.log('sha1: ', file_hash_sha1 );
  console.log('sha256: ', file_hash_sha256 );
  console.log('sha512: ', file_hash_sha512 );
}


var module_db_check_check = require('./module_db_check');
module_check  = module_db_check_check.check(file_hash_sha512);
module_result = module_db_check_check.result;
module_status = module_db_check_check.status;
module_report = module_db_check_check.report;
print_results();

//return 0

var module_virustotal_check = require('./module_virustotal');
module_check  = module_virustotal_check.check(file_hash_sha256);
module_result = module_virustotal_check.result;
module_status = module_virustotal_check.status;
module_report = module_virustotal_check.report;
print_results();

//return 0

var module_simpleav_scan_check  = require('./module_simpleav');
module_check  = module_simpleav_scan_check.check(filename);
module_result = module_simpleav_scan_check.result;
module_status = module_simpleav_scan_check.status;
module_report = module_simpleav_scan_check.report;
print_results();

//return 0

var module_clamav_scan_check  = require('./module_clamav');
module_check  = module_clamav_scan_check.check(filename);
module_result = module_clamav_scan_check.result;
module_status = module_clamav_scan_check.status;
module_report = module_clamav_scan_check.report;
print_results();

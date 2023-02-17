var config  = require('./config-file-hash.json');
const crypto = require('crypto');
const fs = require('fs');


var verbose = config.verbose;

var hash_md5_result = "";
var hash_sha1_result = "";
var hash_sha256_result = "";
var hash_sha512_result = "";


if (verbose) {
  //console.log('hash_sha512_result: ',hash_sha512_result);
}

function isEmpty(value) {
  return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}


var filehash = function(filename) {
	const hash_md5 = crypto.createHash('md5');
	const hash_sha1 = crypto.createHash('sha1');
	const hash_sha256 = crypto.createHash('sha256');
	const hash_sha512 = crypto.createHash('sha512');

  if (verbose) console.log( 'file to hash: ',filename );

  if (isEmpty(filename)) {
    if (verbose) console.log('module_file_hash: Empty input filename.');
    return 1;
  }

  if (!fs.existsSync(filename)) {
    if (verbose) console.log('Input file NOT found.');
    return 2;
  }

  if (verbose) console.log('read file.');

  var input;
  input = fs.readFileSync(filename);
  hash_md5.update(input);
  hash_sha1.update(input);
  hash_sha256.update(input);
  hash_sha512.update(input);
  hash_md5_result = hash_md5.digest('hex');
  hash_sha1_result = hash_sha1.digest('hex');
  hash_sha256_result = hash_sha256.digest('hex');
  hash_sha512_result = hash_sha512.digest('hex');
  module.exports.hash_md5 = hash_md5_result;
  module.exports.hash_sha1 = hash_sha1_result;
  module.exports.hash_sha256 = hash_sha256_result;
  module.exports.hash_sha512 = hash_sha512_result;
  if (verbose) console.log('hash_sha512_result: ',hash_sha512_result);

  if (verbose) console.log('file hash done.');
  return 0;
};


module.exports.filehash = filehash;
module.exports.hash_md5 = hash_md5_result;
module.exports.hash_sha1 = hash_sha1_result;
module.exports.hash_sha256 = hash_sha256_result;
module.exports.hash_sha512 = hash_sha512_result;


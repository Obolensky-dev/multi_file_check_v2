var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const {exec} = require("child_process");
var fileContent, fileContentCSS, fileContentJS, fileContentConf;

var config  = require('./config-frontend-server.json');  // подключаем файл конфигурации для модулей

var file_path; //путь к файлу
var file_name, file_size; // имя файла, размер

var verbose = 1; //переменная для вывода результата модулей

//переменные для модуля контрольных сумм
var filehash;
var file_hash_md5;
var file_hash_sha1;
var file_hash_sha256;
var file_hash_sha512;

//переменные для остальных модулей
var module_check;
var module_status;
var module_result;
var module_report;
var file_type;
var stop_check = 0;

//данные из файла конфигурации
var number_of_module = config.number_of_module;
var modules = config.modules;
var n_of_m_counter = 1; //счётчик для подключения модулей

//подключаем модули
var module_file_hash = require('../mfc_modules/module_file_hash'); 
console.log("подключен модуль: module_file_hash");
var modules_masive = [];
modules_masive[0] = 0; //нолевой элемент не будет использоватся
while (n_of_m_counter <= number_of_module) { 
	console.log("подключен модуль: " + modules[n_of_m_counter].name);
	modules_masive[n_of_m_counter] = require(modules[n_of_m_counter].path);
	n_of_m_counter++;
};
n_of_m_counter = 0; // начинаем счётчик с начала

//функция проверки вида в котором нужно отдать файл модулю
function file_type_check ()
{
	if (modules[n_of_m_counter].file_type == "file_hash_md5")
	{
		file_type =  file_hash_md5;
	}
	if (modules[n_of_m_counter].file_type == "file_hash_sha1")
	{
		file_type =  file_hash_sha1;
	}
	if (modules[n_of_m_counter].file_type == "file_hash_sha256")
	{
		file_type =  file_hash_sha256;
	}
	if (modules[n_of_m_counter].file_type == "file_hash_sha512")
	{
		file_type =  file_hash_sha512;
	}	
	if (modules[n_of_m_counter].file_type == "file_path")
	{
		file_type =  file_path;
	}
	if (modules[n_of_m_counter].file_type == "file_name")
	{
		file_type =  file_name;
	}
}

fileContentCSS = fs.readFileSync('fileupload.css', 'utf8'); // внешний файл стиля  подгружаю

console.log("сервер запущен по адресу: http://127.0.0.1:8080");

//работа с запросами
http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
	  
	var contype = req.headers['content-type'];
	if (!contype || contype.indexOf('multipart/form-data') !== 0){
		res.statusCode = 400;
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<!DOCTYPE html><html><head</head><body> Is not a File! </body></html>');
		res.end();
	} else {
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			console.log(files.filetoupload.name);
			console.log(files.filetoupload.path);
			var oldpath = files.filetoupload.path; //откуда зарали файл
			file_path = 'C:\\mult_file_check\\test_data\\' + files.filetoupload.name;  //папка куда файл кладётся
			file_name = files.filetoupload.name; // запоминаем имя файла
			file_size = files.filetoupload.size; // запоминаем размер файла
		fs.rename(oldpath, file_path, function (err) {
			if (err) throw err;
			
		console.log('scan starting.. ');
			
			
			//здесь выводим html страницу, внутри которой js который слушает ответы с сервера. get запросами инфу присылает server_file.js
			fileContentJS = fs.readFileSync('fileupload.js', 'utf8'); // внешний файл скрипта
			
			n_of_m_counter = 0; // начинаем счётчик с начала
			stop_check = 0;
			
            res.writeHead(200, {'Content-Type': 'text/html'},{"Control-Allow-Origin" : "*"});
			fileContent = fs.readFileSync('fileupload.html', 'utf8');
			res.write(fileContent + " <style> " + fileContentCSS + "</style> <script> " + fileContentJS + "</script>    </body></html>");
           res.end();

			});
		});	
	}
  } 
  
  else if (req.url == '/check') { 
  
		// если пришел запрос на /check то забираем тело запроса
		
	body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {

        postBody = JSON.parse(body);
		
		//проверяем check_number, которые получили в post запросе из js со страницы проверки файла fileupload.html и проводим соответствующую проверку
				
		if (n_of_m_counter <= number_of_module)  
		{	
			if (postBody.check_number == 0){
			
			// запускаем модуль подсчёта контрольной суммы 
			filehash = module_file_hash.filehash(file_path);
			file_hash_md5 = module_file_hash.hash_md5;
			file_hash_sha1 = module_file_hash.hash_sha1;
			file_hash_sha256 = module_file_hash.hash_sha256;
			file_hash_sha512 = module_file_hash.hash_sha512;
				if (verbose) {
				//после того как модуль отработал, пишем в консоль результат
				console.log('md5: ', file_hash_md5 );
				console.log('sha1: ', file_hash_sha1 );
				console.log('sha256: ', file_hash_sha256 );
				console.log('sha512: ', file_hash_sha512 );

				// далее отправляем ответ с результатами (post) на запрос обратно клиенту 
				var response = {
				'number_of_module': number_of_module,  //отправляем общее колличество модулей 
				"check_name": "hash",
				'check_number': 0,
				'stop_check': 0,
				'file_name': file_name,
				'file_size': file_size,
				'md5': file_hash_md5,
				'sha1' : file_hash_sha1,
				'sha256' : file_hash_sha256,
				'sha512' : file_hash_sha512
				};
	
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.end(JSON.stringify(response));
				console.log('Обработан запрос № '+postBody.check_number+ ' от клиента id:');
	
				}
			console.log("n_of_m_counter 0: " + n_of_m_counter);	
				
			n_of_m_counter++; //+1 к счётчику
			
			console.log("postBody.check_number 0: " + postBody.check_number);
			
			}
			
			if (postBody.check_number > 0){
								
				//функция печати и отправки результата модулей
				function print_send_results() {
					if (verbose) {
						console.log(module_check);
						console.log(module_result);
						console.log(module_status);
						console.log(module_report);
						if (n_of_m_counter == number_of_module){  //проверяем, что проверки закончились
							stop_check = 1;
						}
						// далее отправляем ответ с результатами (post) на запрос обратно клиенту 
						var response = {
						"check_name": modules[n_of_m_counter].name,
						'check_number': n_of_m_counter,
						'stop_check': stop_check,
						'resultoverall': module_result,
						'module_report': module_report,
						};
	
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.setHeader('Access-Control-Allow-Origin', '*');
						res.end(JSON.stringify(response));
						console.log('Обработан запрос № '+postBody.check_number+ ' от клиента id:');	
					}
				
				} 
				file_type_check (); //проверяем тип файла
				
				if (postBody.check_number == n_of_m_counter) 
				{	
					module_check  = modules_masive[n_of_m_counter].check(file_type);
					module_result = modules_masive[n_of_m_counter].result;
					module_status = modules_masive[n_of_m_counter].status;
					module_report = modules_masive[n_of_m_counter].report;
					
					print_send_results();
					n_of_m_counter++;

				}


			}
		}
		
			
  });
  
  }
  
	else {
		
		//выдаю страницу для загрузки файла
	
    res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(' <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head> ' + " <style>"+ fileContentCSS+ " </style> <body> ");  // подгружаю внешний файл стиля
	res.write('<div class="service_name">Интерактивная система многоуровневой проверки файлов</br><div style="font-size: 15px;">Создана в рамках выпускной квалификационной работы студента кафедры МКиИТ МТУСИ </br>Оболенского Бориса Вячеславовича</div></div>');
	res.write('<form action="/fileupload" method="post" enctype="multipart/form-data">');
	//res.write('<input type="file" name="filetoupload"><br>');
	res.write('<div class=center_page><label class="fileContainer"><div class="hide_box">Загрузить файл</div><input type="file" name="filetoupload"></label></br></br></br>');
	res.write('<button class="btn_submit" type="submit" name="action">Отправить</button> ');
	res.write('</div></form> </body> </html>');
	return res.end();
  }
}).listen(8080); 

var xhr = new XMLHttpRequest();
var stop_check = 0; //переменная по которой остановиться таймер запросов от клиента к серверу (информацию о том что проверки закончились отправляет сервер в последнем post запросе)
var server_error = 0; //переменная для подсчёта ошибок доступа к серверу
var check_number = 0; //номер проверки
var result_over = 0;
get_start(); // запускаем функцию
		
function get_start(){ //функция отправки запроса на сервер
xhr.open('POST', 'http://127.0.0.1:8080/check');
var send_data_1 = JSON.stringify({"check_number": check_number});
xhr.send(send_data_1);
xhr.onreadystatechange = function() {
if (this.readyState != 4) return;
		
	if (this.status != 200) {  //вывод ошибки если сервер не прислал статус 200
	console.log('ошибка: ' + this.status + ' запрос не удался');
	server_error++; //записываем колличество ошибок доступа к серверу
	console.log('Колличество ошибок: '+server_error);
		if (server_error > 5)  //останавливаем запросы если сервер не ответил ни больше 5 запросов
		{
			document.getElementById('header_1').remove();
			document.getElementById('body').remove();
			error_text.insertAdjacentHTML("beforeend", '<br /><div class="hash"><strong>Сервер недоступен! </strong> Попробуйте позже </br> Cейчас вы будите перенаправлены на страницу загрузки файла</div>');
			function tick() {  //таймер
			document.location.href = '../'  // относительный путь на страницу выше 
			}
			setTimeout(tick, 5000); //5 сек
			return;
		}
	get_start(); // запускаем функцию заново
    } 
	else {
		if (server_error > 0)  //обнуляем счетчик ошибок если сервер начал отвечать
		{
			server_error = 0;
		}	
		stop_check = JSON.parse(this.responseText).stop_check;
		
		if (stop_check !=1){  //проверяем что проверки не закончились
			//выводим данные по каждой проверке
			if (check_number == 0){
				document.getElementById("loader2").remove();
				document.getElementById("loader3").remove();
	
				file_hash.insertAdjacentHTML("beforeend", '<br /><div class="hash"><strong>md5: </strong>'+ JSON.parse(this.responseText).md5 + '</div>');
				file_hash.insertAdjacentHTML("beforeend", '<br /><div class="hash"><strong>sha1: </strong>'+ JSON.parse(this.responseText).sha1 + '</div>');
				file_hash.insertAdjacentHTML("beforeend", '<br /><div class="hash"><strong>sha256: </strong>'+ JSON.parse(this.responseText).sha256 + '</div>');
				file_hash.insertAdjacentHTML("beforeend", '<br /><div class="hash"><strong>sha512: </strong>'+ JSON.parse(this.responseText).sha512 + '</div>');
				document.getElementById("file_size_real").innerHTML='<br />'+((JSON.parse(this.responseText).file_size)/1048576).toFixed(4) + ' Мб'; // получаем с сервера значение размера в байтах и переводим в мегабайты и округляем до 3-х знаков после запятой
				document.getElementById("file_name").innerHTML = JSON.parse(this.responseText).file_name; 
				document.getElementById("result_all").innerHTML = JSON.parse(this.responseText).number_of_module; //вывод колличества модулей
			}
			if (check_number > 0) {
				if (check_number == JSON.parse(this.responseText).check_number){
					if ((JSON.parse(this.responseText).resultoverall == "DETECTED")||(JSON.parse(this.responseText).resultoverall == "FOUND")||(JSON.parse(this.responseText).resultoverall == "Файл найден в базах модуля")){  //если найдено то обновляем статус общей информации
						result_over++;
						document.getElementById("result_over").innerHTML = result_over;
					}
					loader4.insertAdjacentHTML("beforeBegin", '<br /><div><strong>'+ JSON.parse(this.responseText).check_name + '</strong></div>');//вывод названия проверки
					loader4.insertAdjacentHTML("beforeBegin", '<br /><div>' + JSON.parse(this.responseText).resultoverall + '</div>');//вывод названия проверки
					//loader4.insertAdjacentHTML("beforeBegin", '<br /><div>' + JSON.parse(this.responseText).module_report + '</div>');//вывод названия проверки
				}
			


			}
			
			check_number++; //добавляем к счетчику проверок
			get_start(); //вызываем функцию еще раз, чтобы зациклить отправку
		}
		else {
		//выводим поледний результат, убираем анимации
		
		if (check_number == JSON.parse(this.responseText).check_number){
					if ((JSON.parse(this.responseText).resultoverall == "DETECTED")||(JSON.parse(this.responseText).resultoverall == "FOUND")||(JSON.parse(this.responseText).resultoverall == "Файл найден в базах модуля")){  //если найдено то обновляем статус общей информации
						result_over++;
						document.getElementById("result_over").innerHTML = result_over;
		}}

		loader4.insertAdjacentHTML("beforeBegin", '<br /><div><strong>'+ JSON.parse(this.responseText).check_name + '</strong></div>');//вывод названия проверки
		loader4.insertAdjacentHTML("beforeBegin", '<br /><div>' + JSON.parse(this.responseText).resultoverall + '</div>');//вывод названия проверки
		//loader4.insertAdjacentHTML("beforeBegin", '<br /><div>' + JSON.parse(this.responseText).module_report + '</div>');//вывод названия проверки

		document.getElementById("loader1").remove();
		document.getElementById("loader4").remove();
		document.getElementById("text_pls_wait").innerHTML = "Все проверки выполнены!";
		
		
		return;
		}
	}
}
}
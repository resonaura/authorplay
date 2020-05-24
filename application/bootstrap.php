<?php

	// Подключаем файлы ядра
	require_once 'core/model.php';
	require_once 'core/view.php';
	require_once 'core/controller.php';

	// Основные константы
	define('ACTION_SUCCESS', 1);
	define('ERROR_FIELD_EMPTY_DATA', 20);
	define('ERROR_USER_NOT_FOUND', 21);
	define('ERROR_USER_ALREADY_EXISTS', 22);
	define('ERROR_INVALID_PWD', 23);
	define('ERROR_MYSQL', 24);
	define('ERROR_UNAUTHORIZED', 25);
	define('UPLOADS_FOLDER', dirname(__DIR__) . '\\uploads');
	define('VIEWS_FOLDER', dirname(__DIR__) . '\\application\\views');

	/*
		Здесь обычно подключаются дополнительные модули, реализующие различный функционал:
		> аутентификацию
		> кеширование
		> работу с формами
		> абстракции для доступа к данным
		> ORM
		> Unit тестирование
		> Benchmarking
		> Работу с изображениями
		> Backup
		> и др.
	*/

	// Подключаем компоненты
	require_once 'class.db.php';
	require_once 'class.music.php';

	use DatabaseManager\Database as Database;
	use MusicManager\Manager as MusicManager;

	session_start(); // Запускаем сессию

	$db = new Database('localhost', 'admin', '4TE5CF67C5', 'authorplay_new'); // Подключаемся к БД
	$musicMgr = new MusicManager($db);

	require_once 'core/route.php'; // Подключаем маршрутизатор
	Route::Start(); // Запускаем маршрутизатор
?>
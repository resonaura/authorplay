<?php

namespace AuthorPlay;

use WeRtOG\FoxyMVC\Route;
use WeRtOG\Utils\DatabaseManager\Database;
use WeRtOG\Utils\PathTools;

require 'vendor/autoload.php';

require 'tools/database/DatabaseManager.php';
require 'tools/database/Database.php';
require 'tools/path/PathTools.php';

require 'config.php';

define('MVC_ASSETS', dirname(__DIR__) . '/assets');
define('MVC_MODELS', __DIR__ . '/models');
define('MVC_CONTROLLERS', __DIR__ . '/controllers');

define('PROJECT_ABSOLUTE', PathTools::GetProjectRoot());
define('PROJECT_ABSOLUTE_STORAGE', PROJECT_ABSOLUTE . 'storage');
define('PROJECT_ABSOLUTE_ASSETS', PROJECT_ABSOLUTE . 'assets');

define('PROJECT_STORAGE', dirname(__DIR__) . '/storage');

define('IMAGE_STORAGE', PROJECT_STORAGE . '/images');
define('AUDIO_STORAGE', PROJECT_STORAGE . '/audio');

define('PUBLIC_ROOT_URL', PathTools::GetCurrentOrigin() . PathTools::GetProjectRoot());

define('PUBLIC_STORAGE_URL', PathTools::GetCurrentOrigin() . PROJECT_ABSOLUTE_STORAGE);

Route::ConnectFolder(MVC_MODELS);
Route::ConnectFolder(MVC_CONTROLLERS);

if (isset($DatabaseConnection)) {
  $Database = new Database($DatabaseConnection);

  $SQLRecoveryDir = __DIR__ . '/backup/sql';
  $Database->CreateTablesIfNotExist(['artists', 'genres', 'albums', 'songs', 'album_genres'], $SQLRecoveryDir);

  $ProjectModels = [
    'ContentManagerModel' => new ContentManagerModel($Database)
  ];

  Route::Start(
    ProjectNamespace: __NAMESPACE__,
    ProjectPath: dirname(__DIR__),
    Models: $ProjectModels
  );
} else {
  echo 'Config not exists.';
  exit;
}
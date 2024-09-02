<?php

// CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

// Debug
ini_set('display_errors', 1);
error_reporting(E_ALL & ~E_DEPRECATED);

// App
require_once 'app/init.php';
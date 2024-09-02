<?php

/*
    WeRtOG
    BottoGram
*/
namespace WeRtOG\Utils;

use \Exception;

class PathTools
{
  public static function GetProjectRoot()
  {
    if (!isset($_SERVER['DOCUMENT_ROOT']) || !isset($_SERVER['SCRIPT_FILENAME'])) {
      throw new Exception("Unable to determine project root: SERVER variables not set.");
    }

    $scriptDir = dirname($_SERVER['SCRIPT_FILENAME']);
    $docRoot = $_SERVER['DOCUMENT_ROOT'];

    if (strpos($scriptDir, $docRoot) !== 0) {
      throw new Exception("Unable to determine project root: Script not under DOCUMENT_ROOT.");
    }

    $relativePath = substr($scriptDir, strlen($docRoot));
    $relativePath = '/' . trim($relativePath, '/') . '/';

    return $relativePath;
  }

  public static function GetCurrentOrigin()
  {

    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? 'localhost';
    return "{$protocol}://{$host}";

  }
}
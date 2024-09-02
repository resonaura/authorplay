<?php

/*
    WeRtOG
    BottoGram
*/
namespace WeRtOG\Utils\DatabaseManager\Models;

class DatabaseConnection
{
  public function __construct(
    public string $Server,
    public string $User,
    public string|null $Password,
    public string $Database
  ) {
  }
}
<?php

/*
    WeRtOG
    BottoGram
*/
namespace WeRtOG\Utils\DatabaseManager\Models;

class ChangedProperty
{
  public function __construct(
    public string $Name,
    public mixed $Value
  ) {
  }
}

?>
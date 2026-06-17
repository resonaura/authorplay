<?php

namespace AuthorPlay;

use WeRtOG\Utils\DatabaseManager\Models\DatabaseTableItemModel;

class Genre extends DatabaseTableItemModel
{
  public int $ID;
  public string $Name;
}
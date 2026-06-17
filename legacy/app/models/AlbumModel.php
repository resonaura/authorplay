<?php

namespace AuthorPlay;

use WeRtOG\Utils\DatabaseManager\Models\DatabaseTableItemModel;

class Album extends DatabaseTableItemModel
{
  public int $ID;
  public int $ArtistID;
  public string $Title;
  public int $Year;
}
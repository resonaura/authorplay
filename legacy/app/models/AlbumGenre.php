<?php

namespace AuthorPlay;

use WeRtOG\Utils\DatabaseManager\Models\DatabaseTableItemModel;

class AlbumGenre extends DatabaseTableItemModel
{
  public int $ID;
  public int $AlbumID;
  public int $GenreID;
}
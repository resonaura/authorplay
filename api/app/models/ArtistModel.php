<?php

namespace AuthorPlay;

use WeRtOG\Utils\DatabaseManager\Models\DatabaseTableItemModel;

class Artist extends DatabaseTableItemModel
{
  public int $ID;
  public string $Title;
  public string $ShortTag;
  public ?string $YouTubeLink;
  public ?array $Resources;

  public function __construct(array $Parameters = [])
  {
    parent::__construct([
      ...$Parameters,
      'Resources' => [
        'Poster' => PUBLIC_STORAGE_URL . '/images/artists/' . $Parameters['ID'] . '.webp?v=2'
      ]
    ]);
  }
}
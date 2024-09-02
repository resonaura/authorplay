<?php

namespace AuthorPlay;

use WeRtOG\Utils\DatabaseManager\Models\DatabaseTableItemModel;

class Song extends DatabaseTableItemModel
{
  public int $ID;
  public int $ArtistID;
  public ?string $ArtistName;
  public ?string $ArtistShortTag;
  public int $AlbumID;
  public ?string $AlbumName;
  public string $Title;
  public ?string $Feat;
  public ?int $Year;
  public ?array $Resources;

  public function __construct(array $Parameters = [])
  {
    parent::__construct([
      ...$Parameters,
      'Resources' => [
        'Audio' => PUBLIC_ROOT_URL . 'content/stream/?id=' . $Parameters['ID'],
        'Poster' => PUBLIC_STORAGE_URL . '/images/albums/' . $Parameters['AlbumID'] . '.webp'
      ]
    ]);
  }
}
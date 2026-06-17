<?php

namespace AuthorPlay;

use WeRtOG\Utils\DatabaseManager\Database;

class ContentManagerModel
{
  protected Database $Database;

  public function __construct(Database $Database)
  {
    $this->Database = $Database;
  }

  /**
   * Method to retrieve an artist by ID
   * @param int $ID Artist ID
   * @return ?Artist Artist object or null if not found
   */
  public function GetArtist(int $ID): ?Artist
  {
    return $this->Database->FetchQuery("SELECT * FROM artists WHERE ID='$ID'", false, Artist::class);
  }


  /**
   * Method to retrieve an artist by short tag
   * @param string $ShortTag Artist ID
   * @return ?Artist Artist object or null if not found
   */
  public function GetArtistByShortTag(string $ShortTag): ?Artist
  {
    return $this->Database->FetchQuery("SELECT * FROM artists WHERE ShortTag='$ShortTag'", false, Artist::class);
  }

  /**
   * Method to retrieve an album by ID
   * @param int $ID Album ID
   * @return ?Album Album object or null if not found
   */
  public function GetAlbum(int $ID): ?Album
  {
    return $this->Database->FetchQuery("SELECT * FROM albums WHERE ID='$ID'", false, Album::class);
  }

  /**
   * Method to retrieve a list of albums by artist ID
   * @param int $ArtistID Artist ID
   * @return Album[] List of albums
   */
  public function GetArtistAlbums(int $ArtistID): array
  {
    return $this->Database->FetchQuery("SELECT * FROM albums WHERE ArtistID='$ArtistID'", true, Album::class) ?? [];
  }

  /**
   * Method to retrieve a list of artists
   * @param int $Limit Limit for the number of artists
   * @return Artist[] List of artists
   */
  public function GetArtists(int $Limit = 500): array
  {
    return $this->Database->FetchQuery("SELECT * FROM artists ORDER by ID DESC LIMIT $Limit", true, Artist::class) ?? [];
  }

  /**
   * Method to retrieve a list of songs in an album
   * @param int $ID Album ID
   * @return Song[] List of songs
   */
  public function GetAlbumSongs(int $ID): array
  {
    return $this->Database->FetchQuery("SELECT s.*, ar.Title as ArtistName, ar.ShortTag as ArtistShortTag, al.Title as AlbumName FROM songs s 
                                        JOIN artists ar ON s.ArtistID = ar.ID 
                                        JOIN albums al ON s.AlbumID = al.ID 
                                        WHERE s.AlbumID='$ID' 
                                        ORDER by s.Year DESC, s.ID DESC", true, Song::class) ?? [];
  }

  /**
   * Method to retrieve a list of songs
   * @param int $Limit Limit for the number of songs
   * @return Song[] List of songs
   */
  public function GetSongs(int $Limit = 500): array
  {
    return $this->Database->FetchQuery("SELECT s.*, ar.Title as ArtistName, ar.ShortTag as ArtistShortTag, al.Title as AlbumName FROM songs s 
                                        JOIN artists ar ON s.ArtistID = ar.ID 
                                        JOIN albums al ON s.AlbumID = al.ID 
                                        ORDER by al.Year DESC, s.ID DESC LIMIT $Limit", true, Song::class) ?? [];
  }

  /**
   * Method to retrieve a list of songs by artist ID
   * @param int $ArtistID Artist ID
   * @param int $Limit Limit for the number of songs
   * @return Song[] List of songs
   */
  public function GetSongsByArtist(int $ArtistID, int $Limit = 500): array
  {
    return $this->Database->FetchQuery("SELECT s.*, ar.Title as ArtistName, al.Title as AlbumName FROM songs s 
                                        JOIN artists ar ON s.ArtistID = ar.ID 
                                        JOIN albums al ON s.AlbumID = al.ID 
                                        WHERE s.ArtistID='$ArtistID' 
                                        ORDER by al.Year DESC, s.ID DESC LIMIT $Limit", true, Song::class) ?? [];
  }

  /**
   * Method to retrieve a song by ID
   * @param int $ID Song ID
   * @return ?Song Song object or null if not found
   */
  public function GetSongByID(int $ID): ?Song
  {
    return $this->Database->FetchQuery("SELECT s.*, ar.Title as ArtistName, al.Title as AlbumName FROM songs s 
                                        JOIN artists ar ON s.ArtistID = ar.ID 
                                        JOIN albums al ON s.AlbumID = al.ID 
                                        WHERE s.ID='$ID'", false, Song::class);
  }

  /**
   * Method to retrieve a genre by ID
   * @param int $ID Genre ID
   * @return ?Genre Genre object or null if not found
   */
  public function GetGenre(int $ID): ?Genre
  {
    return $this->Database->FetchQuery("SELECT * FROM genres WHERE ID='$ID'", false, Genre::class);
  }

  /**
   * Method to retrieve a list of genres
   * @param int $Limit Limit for the number of genres
   * @return Genre[] List of genres
   */
  public function GetGenres(int $Limit = 500): array
  {
    return $this->Database->FetchQuery("SELECT * FROM genres ORDER BY ID DESC LIMIT $Limit", true, Genre::class) ?? [];
  }

  /**
   * Method to retrieve the genres of a album
   * @param int $AlbumID Song ID
   * @return Genre[] List of genres for the song
   */
  public function GetAlbumGenres(int $AlbumID): array
  {
    return $this->Database->FetchQuery("SELECT g.* FROM album_genres ag JOIN genres g ON ag.GenreID = g.ID WHERE ag.AlbumID='$AlbumID'", true, Genre::class) ?? [];
  }

  /**
   * Method to add a new artist
   * @param string $Title Artist's title
   * @param string $YouTubeLink Artist's YouTube link
   * @return bool Success or failure
   */
  public function AddArtist(string $Title, string $YouTubeLink): bool
  {
    $query = "INSERT INTO artists (Title, YouTubeLink) VALUES ('$Title', '$YouTubeLink')";
    return $this->Database->FetchQuery($query);
  }

  /**
   * Method to add a new album
   * @param int $ArtistID Artist ID
   * @param string $Title Album title
   * @param int $Year Album year
   * @return bool Success or failure
   */
  public function AddAlbum(int $ArtistID, string $Title, int $Year): bool
  {
    $query = "INSERT INTO albums (ArtistID, Title, Year) VALUES ('$ArtistID', '$Title', '$Year')";
    return $this->Database->FetchQuery($query);
  }

  /**
   * Method to add a new song
   * @param int $ArtistID Artist ID
   * @param int $AlbumID Album ID
   * @param string $Title Song title
   * @param string $Feat Featured artist
   * @param string $Year Release year
   * @return bool Success or failure
   */
  public function AddSong(int $ArtistID, int $AlbumID, string $Title, string $Feat, string $Year): bool
  {
    $query = "INSERT INTO songs (ArtistID, AlbumID, Title, Feat, Year) VALUES ('$ArtistID', '$AlbumID', '$Title', '$Feat', '$Year')";
    return $this->Database->FetchQuery($query);
  }

  /**
   * Method to add a genre to a album
   * @param int $SongID Song ID
   * @param int $GenreID Genre ID
   * @return bool Success or failure
   */
  public function AddAlbumGenre(int $SongID, int $GenreID): bool
  {
    $query = "INSERT INTO song_genres (SongID, GenreID) VALUES ('$SongID', '$GenreID')";
    return $this->Database->FetchQuery($query);
  }

  /**
   * Method to update an artist's details
   * @param int $ID Artist ID
   * @param string $Title New title
   * @param string $YouTubeLink New YouTube link
   * @return bool Success or failure
   */
  public function UpdateArtist(int $ID, string $Title, string $YouTubeLink): bool
  {
    $query = "UPDATE artists SET Title='$Title', YouTubeLink='$YouTubeLink' WHERE ID='$ID'";
    return $this->Database->FetchQuery($query);
  }

  /**
   * Method to delete an artist by ID
   * @param int $ID Artist ID
   * @return bool Success or failure
   */
  public function DeleteArtist(int $ID): bool
  {
    $query = "DELETE FROM artists WHERE ID='$ID'";
    return $this->Database->FetchQuery($query);
  }

  /**
   * Method to delete an album by ID
   * @param int $ID Album ID
   * @return bool Success or failure
   */
  public function DeleteAlbum(int $ID): bool
  {
    $query = "DELETE FROM albums WHERE ID='$ID'";
    return $this->Database->FetchQuery($query);
  }

  /**
   * Method to delete a song by ID
   * @param int $ID Song ID
   * @return bool Success or failure
   */
  public function DeleteSong(int $ID): bool
  {
    $query = "DELETE FROM songs WHERE ID='$ID'";
    return $this->Database->FetchQuery($query);
  }
}

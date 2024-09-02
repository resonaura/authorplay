<?php
namespace AuthorPlay;

use WeRtOG\FoxyMVC\Attributes\Action;
use WeRtOG\FoxyMVC\Controller;
use WeRtOG\FoxyMVC\ControllerResponse\JsonView;

class ContentController extends Controller
{
  public ContentManagerModel $ContentManagerModel;

  #[Action]
  public function Index(): JsonView
  {
    return new JsonView([
      'ok' => true,
      'code' => 200
    ]);
  }

  #[Action]
  public function GetArtist(): JsonView
  {
    $ID = (int) ($_GET['id'] ?? 0);
    $Artist = $this->ContentManagerModel->GetArtist($ID);

    if ($Artist) {
      return new JsonView([
        'ok' => true,
        'code' => 200,
        'data' => $Artist
      ]);
    } else {
      return new JsonView([
        'ok' => false,
        'code' => 404,
        'error' => 'Artist not found'
      ], 404);
    }
  }

  #[Action]
  public function GetArtistByShortTag(): JsonView
  {
    $Tag = (string) ($_GET['tag'] ?? null);
    $Artist = $this->ContentManagerModel->GetArtistByShortTag($Tag);

    if ($Artist) {
      return new JsonView([
        'ok' => true,
        'code' => 200,
        'data' => $Artist
      ]);
    } else {
      return new JsonView([
        'ok' => false,
        'code' => 404,
        'error' => 'Artist not found'
      ], 404);
    }
  }

  #[Action]
  public function GetAlbum(): JsonView
  {
    $ID = (int) ($_GET['id'] ?? 0);
    $Album = $this->ContentManagerModel->GetAlbum($ID);

    if ($Album) {
      return new JsonView([
        'ok' => true,
        'code' => 200,
        'data' => $Album
      ]);
    } else {
      return new JsonView([
        'ok' => false,
        'code' => 404,
        'error' => 'Album not found'
      ], 404);
    }
  }

  #[Action]
  public function GetArtistAlbums(): JsonView
  {
    $ArtistID = (int) ($_GET['artist_id'] ?? 0);
    $Albums = $this->ContentManagerModel->GetArtistAlbums($ArtistID);

    return new JsonView([
      'ok' => true,
      'code' => 200,
      'data' => $Albums
    ]);
  }

  #[Action]
  public function GetArtists(): JsonView
  {
    $Limit = (int) ($_GET['limit'] ?? 500);
    $Artists = $this->ContentManagerModel->GetArtists($Limit);

    return new JsonView([
      'ok' => true,
      'code' => 200,
      'data' => $Artists
    ]);
  }

  #[Action]
  public function GetAlbumSongs(): JsonView
  {
    $ID = (int) ($_GET['id'] ?? 0);
    $Songs = $this->ContentManagerModel->GetAlbumSongs($ID);

    return new JsonView([
      'ok' => true,
      'code' => 200,
      'data' => $Songs
    ]);
  }

  #[Action]
  public function GetSongs(): JsonView
  {
    $Limit = (int) ($_GET['limit'] ?? 500);
    $Songs = $this->ContentManagerModel->GetSongs($Limit);

    return new JsonView([
      'ok' => true,
      'code' => 200,
      'data' => $Songs
    ]);
  }

  #[Action]
  public function GetSongsByArtist(): JsonView
  {
    $ArtistID = (int) ($_GET['artist_id'] ?? 0);
    $Limit = (int) ($_GET['limit'] ?? 500);
    $Songs = $this->ContentManagerModel->GetSongsByArtist($ArtistID, $Limit);

    return new JsonView([
      'ok' => true,
      'code' => 200,
      'data' => $Songs
    ]);
  }

  #[Action]
  public function GetSongByID(): JsonView
  {
    $ID = (int) ($_GET['id'] ?? 0);
    $Song = $this->ContentManagerModel->GetSongByID($ID);

    if ($Song) {
      return new JsonView([
        'ok' => true,
        'code' => 200,
        'data' => $Song
      ]);
    } else {
      return new JsonView([
        'ok' => false,
        'code' => 404,
        'error' => 'Song not found'
      ], 404);
    }
  }

  #[Action]
  public function GetGenres(): JsonView
  {
    $Limit = (int) ($_GET['limit'] ?? 500);
    $Genres = $this->ContentManagerModel->GetGenres($Limit);

    return new JsonView([
      'ok' => true,
      'code' => 200,
      'data' => $Genres
    ]);
  }

  #[Action]
  public function GetGenre(): JsonView
  {
    $ID = (int) ($_GET['id'] ?? 0);
    $Genre = $this->ContentManagerModel->GetGenre($ID);

    if ($Genre) {
      return new JsonView([
        'ok' => true,
        'code' => 200,
        'data' => $Genre
      ]);
    } else {
      return new JsonView([
        'ok' => false,
        'code' => 404,
        'error' => 'Genre not found'
      ], 404);
    }
  }

  #[Action]
  public function GetAlbumGenres(): JsonView
  {
    $AlbumID = (int) ($_GET['album_id'] ?? 0);
    $Genres = $this->ContentManagerModel->GetAlbumGenres($AlbumID);

    return new JsonView([
      'ok' => true,
      'code' => 200,
      'data' => $Genres
    ]);
  }

  #[Action]
  public function Stream(): void
  {
    $ID = (int) ($_GET['id'] ?? 0);
    $AudioPath = AUDIO_STORAGE . '/' . $ID . '.flac';

    if (file_exists($AudioPath)) {
      $fileSize = filesize($AudioPath);
      $file = fopen($AudioPath, 'rb');

      // Check if there is a range set in the HTTP header
      if (isset($_SERVER['HTTP_RANGE'])) {
        list($start, $end) = array_replace([0, $fileSize - 1], explode('-', substr($_SERVER['HTTP_RANGE'], 6), 2));
        $end = ('' === $end) ? ($fileSize - 1) : min(abs(intval($end)), $fileSize - 1);
        $start = ('' === $start) ? 0 : max(abs(intval($start)), 0);

        if ($start > $end) {
          header('HTTP/1.1 416 Requested Range Not Satisfiable');
          header('Content-Range: bytes */' . $fileSize);
          exit;
        }

        header('HTTP/1.1 206 Partial Content');
        header('Content-Range: bytes ' . $start . '-' . $end . '/' . $fileSize);
        header('Content-Length: ' . ($end - $start + 1));
      } else {
        header('Content-Length: ' . $fileSize);
      }

      // Common headers
      header('Content-Type: audio/flac');
      header('Content-Disposition: inline; filename="' . basename($AudioPath) . '"');
      header('Accept-Ranges: bytes');
      header('Expires: 0');
      header('Cache-Control: must-revalidate');
      header('Pragma: public');

      // Clear system output buffer
      flush();

      // Set the file pointer to the desired start position
      fseek($file, isset($start) ? $start : 0);

      // Stream the audio file
      while (!feof($file) && (connection_status() == 0)) {
        echo fread($file, 1024 * 1024); // Read in chunks of 1 MB
        flush(); // Flush the output buffer
      }

      fclose($file);
    } else {
      // Return JSON response if the song is not found or the file does not exist
      header('Content-Type: application/json');
      echo json_encode([
        'ok' => false,
        'code' => 404,
        'error' => 'Song not found or file does not exist'
      ]);
      http_response_code(404);
    }
  }


}

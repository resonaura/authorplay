<?php
    namespace MusicManager;

    use \DatabaseManager\Database as Database;

    /**
     * Класс взаимодействия с музыкой
     */
    class Manager {
        protected Database $DB;
       
        /**
         * Конструктор класса взаимодействия с музыкой
         * @param Database $DB БД
         */
        public function __construct(Database $DB) {
            $this->DB = $DB;
        }
        /**
         * Метод для получения исполнителя по ID
         * @param int $ID ID исполнителя
         * @return Author Исполнитель
         */
        public function GetAuthor(int $ID) : ?Author {
            $query_result = $this->DB->fetch_query("SELECT * FROM author WHERE ID='$ID'");
            return new Author($query_result);
        }
        /**
         * Метод для получения альбома по ID
         * @param int $ID ID альбома
         * @return Album Альбом
         */
        public function GetAlbum(int $ID) : ?Album {
            $query_result = $this->DB->fetch_query("SELECT * FROM album WHERE ID='$ID'");
            return $this->GetAlbumFromArray($query_result);
        }
        /**
         * Метод для получения списка альбомов по ID автора
         * @param int $ID ID автора
         * @return array Список альбомов
         */
        public function GetAuthorAlbums(int $ID) : array {
            $result = [];
            $query_result = $this->DB->fetch_query("SELECT * FROM album WHERE AuthorID='$ID'", true);
            
            if($query_result != null) {
                foreach($query_result as $item) {
                    $result[] = $this->GetAlbumFromArray($item);
                }
            }

            return $result;
        }
        /**
         * Метод для получения списка альбомов
         * @param int $Limit Лимит
         * @return array Список альбомов
         */
        public function GetAuthors(int $Limit = 500) : array {
            $result = [];
            $query_result = $this->DB->fetch_query("SELECT * FROM author ORDER by ID DESC LIMIT $Limit", true);
            
            foreach($query_result as $item) {
                $item['Songs'] = $this->GetMusicByAuthor($item['ID']);
                $item['Albums'] = $this->GetAuthorAlbums($item['ID']);
                $result[] = new Author($item);
            }

            return $result;
        }
        /**
         * Метод для получения песен альбома
         * @param int $ID ID альбома
         * @return array Список песен
         */
        public function GetAlbumSongs(int $ID) : array {
            $result = [];
            $query_result = $this->DB->fetch_query("SELECT * FROM music WHERE AlbumID='$ID' ORDER by Year DESC, ID DESC", true);
            
            foreach($query_result as $item) {
                $result[] = $this->GetMusicFromArray($item);
            }

            return $result;
        }
        /**
         * Метод для получения трека из массива
         * @param $Item Массив
         * @return Music трек
         */
        public function GetMusicFromArray(array $Item) : Music {
            return new Music([
                'ID' => $Item['ID'],
                'Title' => $Item['Title'],
                'Author' => $this->GetAuthor($Item['AuthorID']),
                'Feat' => $Item['Feat'],
                'Year' => $Item['Year'],
                'Album' => $this->GetAlbum($Item['AlbumID']),
                'Genre' => $Item['Genre']
            ]);
        }
        /**
         * Метод для получения альбома из массива
         * @param array $Item Массив
         * @return Album Альбом
         **/
        public function GetAlbumFromArray(array $Item) : Album
        {
            return new Album([
                'ID' => $Item['ID'],
                'Title' => $Item['Title'],
                'Author' => $this->GetAuthor($Item['AuthorID'])
            ]);
        }
        /**
         * Метод для получения списка треков
         * @param int $Limit Лимит
         * @return array Список треков
         */
        public function GetMusic(int $Limit = 500) : array {
            $result = [];
            $query_result = $this->DB->fetch_query("SELECT * FROM music ORDER by Year DESC, ID DESC LIMIT $Limit", true);
            
            foreach($query_result as $item) {
                $result[] = $this->GetMusicFromArray($item);
            }

            return $result;
        }
        /**
         * Метод для получения списка треков по ID исполнителя
         * @param int $AuthorID ID исполнителя
         * @param int $Limit Лимит
         * @return array Список треков
         */
        public function GetMusicByAuthor(int $AuthorID, int $Limit = 500) : array {
            $result = [];
            $query_result = $this->DB->fetch_query("SELECT * FROM music WHERE AuthorID='$AuthorID' ORDER by Year DESC, ID DESC LIMIT $Limit", true);
            
            if($query_result != null) {
                foreach($query_result as $item) {
                    $result[] = $this->GetMusicFromArray($item);
                }
            }

            return $result;
        }
        /**
         * Метод для получения трека по ID
         * @param int $ID ID трека
         * @return array Трек
         */
        public function GetMusicByID(int $ID) : ?Music {
            $query_result = $this->DB->fetch_query("SELECT * FROM music WHERE ID='$ID'");

            return $query_result != null ? $this->GetMusicFromArray($query_result) : null;
        }
    }
?>
<?php
    namespace MusicManager;

    include 'class.music.author.php';
    include 'class.music.album.php';
    include 'class.music.manager.php';

    /**
     * Класс класса трека
     */
    class Music {
        public int $ID;
        public string $Title;
        public Author $Author;
        public string $Feat;
        public string $Year;
        public Album $Album;
        public string $Genre;

        /**
         * Конструктор элемента класса трека
         * @param array Массив данных
         */
        public function __construct(array $data) {
            if(empty($data)) return;
            foreach($data as $key => $value) $this->{$key} = $value;
        }
    }
?>
<?php
    namespace MusicManager;

    /**
     * Класс альбома
     */
    class Album {
        public int $ID;
        public string $Title;
        public Author $Author;

        /**
         * Конструктор класса альбома
         * @param array Массив данных
         */
        public function __construct(array $data) {
            if(empty($data)) return;
            foreach($data as $key => $value) $this->{$key} = $value;
        }
    }
?>
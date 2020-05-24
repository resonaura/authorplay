<?php
    namespace MusicManager;

    /**
     * Класс исполнителя
     */
    class Author {
        public int $ID;
        public string $Title;
        public string $YouTube;
        public array $Albums = [];
        public array $Songs = [];

        /**
         * Конструктор класса исполнителя
         * @param array Массив данных
         */
        public function __construct(array $data) {
            if(empty($data)) return;
            foreach($data as $key => $value) $this->{$key} = $value;
        }
    }
?>
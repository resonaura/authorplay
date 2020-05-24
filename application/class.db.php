<?php
    namespace DatabaseManager;

    /**
     * Класс взаимодействия с БД
     */
    class Database {
        protected object $DB;
        protected string $Server;
        protected string $Login;
        protected string $Password;
        protected string $DatabaseName;

        /**
         * Конструктор класса взаимодействия с БД
         * @param string $server Сервер
         * @param string $login Логин
         * @param string $password Пароль
         * @param string $db БД
         */
        public function __construct(string $server, string $login, string $password, string $db) {
            $this->Server = $server;
            $this->Login = $login;
            $this->Password = $password;
            $this->DatabaseName = $db;
            $this->DB = new \mysqli($this->Server, $this->Login, $this->Password, $this->DatabaseName);
        }
        /**
         * Метод для переподключения к БД
         */
        public function Reconnect() {
            $this->DB->close();
            $this->DB = new \mysqli($this->Server, $this->Login, $this->Password, $this->DatabaseName);
        }
        /**
         * Метод для выполнения SQL-запроса
         * @param string $query Запрос
         * @param bool $returnArray Флаг для принудительного возвращения массива
         * @return array Результат
         */
        public function fetch_query(string $query, bool $returnArray = false) : ?array {
            while($this->DB->next_result()) $this->DB->store_result();
            $q = $this->DB->query($query);
            if($q) {
                if(\array_key_exists('num_rows', (array)$q)) {
                    if($q->num_rows > 0) {
                        $d = $q->fetch_assoc();
    
                        if($q->num_rows == 1 && $returnArray == false) {
                            return $d;
                        } else if($q->num_rows >= 1) {
                            $result = [];
                            do {
                                $result[] = $d;
                            }
                            while($d = $q->fetch_assoc());
                            
                            return $result;
                        }
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            } else {
                echo $this->DB->error;
                return null;
            }
        }
        /**
         * Метод для вызова хранимой процедуры
         * @param string $name Имя процедуры
         * @param array $parameters Массив значений параметров
         * @param bool $returnArray Флаг для принудительного возвращения массива
         * @return array Результат
         */
        public function call_procedure(string $name, array $parameters = [], bool $returnArray = false) {
            $parameters_string = count($parameters) > 0 ? "'" . implode("', '", $parameters) . "'" : "";
            $parameters_string = str_replace("'NULL'", 'NULL', $parameters_string);
            return $this->fetch_query("CALL $name($parameters_string)", $returnArray);
        }
        /**
         * Метод для вызова хранимой функции
         * @param string $name Имя процедуры
         * @param array $parameters Массив значений параметров
         * @return array Результат
         */
        public function call_function(string $name, array $parameters = []) {
            $parameters_string = count($parameters) > 0 ? "'" . implode("', '", $parameters) . "'" : "";
            $parameters_string = str_replace("'NULL'", 'NULL', $parameters_string);
            return $this->fetch_query("SELECT $name($parameters_string) AS $name")[$name];
        }
        /**
         * Метод для получения безопасной строки (защита от SQL-инъекций)
         * @param $string Строка
         * @return string Безопасная строка
         */
        public function escape(string $string) : string {
            return $this->DB->real_escape_string($string);
        }
    }
?>
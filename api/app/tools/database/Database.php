<?php

/*
    WeRtOG
    BottoGram
*/
namespace WeRtOG\Utils\DatabaseManager;

foreach (glob(__DIR__ . "/exceptions/*.php") as $Filename)
  require_once $Filename;
foreach (glob(__DIR__ . "/models/*.php") as $Filename)
  require_once $Filename;

use mysqli;
use WeRtOG\Utils\DatabaseManager\Exceptions\DatabaseException;
use WeRtOG\Utils\DatabaseManager\Models\DatabaseConnection;

/**
 * Класс взаимодействия с БД
 * @property object $DB Сама БД
 */
class Database
{
  protected object $DB;
  protected DatabaseConnection $DatabaseConnection;
  /**
   * Конструктор класса взаимодействия с БД
   */
  public function __construct(DatabaseConnection $DatabaseConnection)
  {
    $this->DatabaseConnection = $DatabaseConnection;

    $this->Connect();
  }

  public function Connect()
  {
    $this->DB = @new mysqli(
      $this->DatabaseConnection->Server,
      $this->DatabaseConnection->User,
      $this->DatabaseConnection->Password,
      $this->DatabaseConnection->Database
    );

    if (mysqli_connect_errno()) {
      throw new DatabaseException("Подключение к серверу MySQL невозможно. Причина: " . mysqli_connect_error());
    }

    $this->DB->set_charset("utf8mb4");
  }

  /**
   * Метод для переподключения к БД
   */
  public function Reconnect()
  {
    $this->Disconnect();
    $this->Connect();
  }

  /**
   * Метод для отключения от БД
   */
  public function Disconnect()
  {
    $this->DB->close();
  }

  /**
   * Метод для выполнения SQL-запроса
   * @param string $Query Запрос
   * @param bool $ReturnArray Флаг для принудительного возвращения массива
   * @param string $ClassName Имя класса 
   * @return mixed Результат
   */
  public function FetchQuery(string $Query, bool $ReturnArray = false, string $ClassName = null)
  {
    if (!$this->DB->ping())
      $this->Reconnect();

    // Дожидаемся завершения предыдущих запросов
    while ($this->DB->next_result())
      $this->DB->store_result();

    // Выполняем запрос
    $QueryResult = $this->DB->query($Query);

    // Если запрос выполнен успешно
    if ($QueryResult) {

      // Проверяем есть ли результат
      if (property_exists($QueryResult, 'num_rows')) {

        // Если есть строки
        if ($QueryResult->num_rows > 0) {
          // Обрабатываем первую строку
          $FetchResult = $QueryResult->fetch_assoc();

          // Если строка всего одна 
          if ($QueryResult->num_rows == 1 && $ReturnArray == false) {

            /* Если необходимо вернуть объект конкретного класса 
                И если этот класс существует, то его и возвращаем */
            if ($ClassName != null && class_exists($ClassName)) {
              return new $ClassName($FetchResult);
            }

            // В ином случае возвращаем просто массив
            else {
              return $FetchResult;
            }

            // Если строк несколько
          } else if ($QueryResult->num_rows >= 1) {

            // Подготавливаем массив результата
            $Result = [];

            // Проходимся по всем строкам
            do {

              // Если необходимо вернуть массив объектов классов
              // И если класс существует
              // Добавляем объект в массив
              if ($ClassName != null && class_exists($ClassName)) {
                $Result[] = new $ClassName($FetchResult);
              }

              // В ином случае просто добавляем массив текущей строки в массив результата
              else {
                $Result[] = $FetchResult;
              }
            }
            while ($FetchResult = $QueryResult->fetch_assoc());

            // Возвращаем массив результата
            return $Result;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }

      // Если запрос провалился сообщаем об этом в логах
    } else {
      throw new DatabaseException("Возникла ошибка MySQL: " . $this->DB->error . "\n при выполнении запроса: " . $Query);
    }
  }

  /**
   * Метод для получения ID последней вставленной строки
   * @return mixed ID строки
   */
  public function GetInsertID()
  {
    return $this->DB->insert_id;
  }

  /**
   * Метод для вызова хранимой процедуры
   * @param string $Name Имя процедуры
   * @param array $Parameters Массив значений параметров
   * @param bool $ReturnArray Флаг для принудительного возвращения массива
   * @param string $ClassName Имя класса 
   * @return mixed Результат
   */
  public function CallProcedure(string $Name, array $Parameters = [], bool $ReturnArray = false, string $ClassName = null)
  {
    $ParametersString = count($Parameters) > 0 ? "'" . implode("', '", $Parameters) . "'" : "";
    $ParametersString = str_replace("'NULL'", 'NULL', $ParametersString);
    return $this->FetchQuery("CALL $Name($ParametersString)", $ReturnArray, $ClassName);
  }

  /**
   * Метод для вызова хранимой функции
   * @param string $Name Имя процедуры
   * @param array $Parameters Массив значений параметров
   * @param string $ClassName Имя класса 
   * @return mixed Результат
   */
  public function CallFunction(string $Name, array $Parameters = [], string $ClassName = null)
  {
    $ParametersString = count($Parameters) > 0 ? "'" . implode("', '", $Parameters) . "'" : "";
    $ParametersString = str_replace("'NULL'", 'NULL', $ParametersString);
    return $this->FetchQuery("SELECT $Name($ParametersString) AS $Name", false, $ClassName)[$Name];
  }

  /**
   * Метод для получения безопасной строки (защита от SQL-инъекций)
   * @param string $String Строка
   * @return string Безопасная строка
   */
  public function EscapeString(string $String): string
  {
    return $this->DB->real_escape_string($String);
  }

  /**
   * Метод для проверки существования таблицы и создания её (при отсутствии)
   * @param string $Name Имя таблицы
   * @param bool $CreateTable флаг создания таблицы при её отсутствии
   * @return bool Результат проверки
   */
  public function CheckTable(string $Name, bool $CreateTable = true, ?string $SQLRecoveryDir = null): bool
  {
    $query = $this->DB->query("SHOW TABLES LIKE '$Name';");
    $count = isset($query->num_rows) ? ($query->num_rows >= 1 ? $query->num_rows : 0) : 0;

    if ($count == 0) {
      $sql_path = ($SQLRecoveryDir ? $SQLRecoveryDir . '/' : __DIR__ . '/default/database/') . $Name . '.sql';
      if (file_exists($sql_path) && $CreateTable) {
        $commands = file_get_contents($sql_path);
        $this->DB->multi_query($commands);
        while ($this->DB->next_result())
          $this->DB->store_result();
      }

      return false;
    }

    return true;
  }

  /**
   * Метод для проверки существования таблиц и создания их (при отсутствии)
   * @param string[] $Tables Таблицы
   * @param string $SQLRecoveryDir Папка с файлами бекапа таблиц
   * @return void
   */
  public function CreateTablesIfNotExist(array $Tables, string $SQLRecoveryDir): void
  {
    foreach ($Tables as $Table) {
      $this->CheckTable($Table, true, $SQLRecoveryDir);
    }
  }
}
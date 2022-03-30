<?php 

namespace core;


/**
 * Object Relational Mapper
 */
class ORM {


  /**
   * Get JSON Models
   */
  public function getJSONModels() {
    $files = scandir( FSROOT . "/models-json/" );
    $tables = [];
    
    foreach($files as $f) {
      if($f == '.' || $f == '..' ) continue;
      if( strpos($f, '.json') > -1 ) {
        $tables[] = json_decode( file_get_contents( FSROOT . "/models-json/" . $f ) );
      }
    }

    return $tables; 
  }

  /**
   * Get DB Tables
   */
  public function getDBTables() {
    global $db, $config;
    $tables = $db->getTables();
    
    // Remove Rrefix
    $tablesText = json_encode($tables);
    $tablesText = str_replace( DB_PREFIX, '', $tablesText );

    return json_decode($tablesText);
  }


  /**
   * Check JSON Models with MySQL Tables
   */
  public function checkTables() {
    $JSONModels = $this->getJSONModels();
    $DBTables = $this->getDBTables();
    $errors = [
      'notfound' => [],
      'notfound_columns' => [],
      'type' => []
    ];

    foreach( $JSONModels as $i => $json_table ) {
      
      $notfound = true;
      
      foreach( $DBTables as $j => $db_table ) {
        if( $json_table->table == $db_table->table ) {
          $notfound = false;
          array_splice( $DBTables, $j, 1 );
          break;
        }
      }

      if($notfound) $errors['notfound'][] = [
        "table" => $json_table->table
      ];
    }

    return [ "errors" => $errors, 'dbtables' => $DBTables ];
  }
}
<?php if(!defined("ACCESS")) die("Direct access not allowed."); 
/**
 * Database Class
 *
 * An API for validating, formatting, and executing SQL queries.
 *
 * @package: Zen
 * @author: Wendell Cano
 * @copyright: 2011 Wendell Cano
 * @version: 1.0
 */
class Database {
	
	var $config, $prefix;
	
	/* Connection */
	public $db, $connected = false, $error, $last_query = [], $queries = array();
	
	protected static $instances = array();
	
	/**
	 * Construct database
	 */	
	function __construct() {
	
		if($this->connect()) {
			$this->connected =  true; 
		}
		
		else
			die("Could not connect to database"); 
		
	}	
	
	
	/**
	 * Setup connection
	 * 
	 * Sets up the connection
	 * 
	 * @return bool
	 */
	function connect() {
		
		$this->prefix = DB_PREFIX; 
		
		# connect to the database  
		try {  
			$this->pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS, [] );  
			$this->pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );  
			
			return true; 
		}
		
		catch(PDOException $e) {
			file_put_contents('PDOErrors.txt', $e->getMessage() . "\n", FILE_APPEND);  
			return false; 
		}
		
	}
	

	/**
	 * Get Tables
	 */
	public function getTables() {
		
		// Get Tables
		$sql = "SHOW TABLES";
		$statement = $this->pdo->prepare($sql);
		$statement->execute();
		$tablesList = $statement->fetchAll(PDO::FETCH_NUM);
		$tables = [];
		foreach($tablesList as $table) {
			
			$sql = "SHOW COLUMNS FROM " . $table[0];
			$statement = $this->pdo->prepare($sql);
			$statement->execute();
			$columnsList = $statement->fetchAll(PDO::FETCH_NUM);
			$columns = [];
			foreach( $columnsList as $column ) $columns[] = $column[0];

			$tables[] = [
				'table' => $table[0],
				'columns' => $columnsList
			];
		}
		
		return $tables; 
		
	}


	/**
	 * Form Query
	 * 
	 * Creates the query string.
	 * 
	 * @param string $task begins the query string.
	 * @param string $table table.
	 * @param string $fields fields.
	 * @param array $wheres 'where' part of the query.
	 * @param array $orderby 'order by' part of the query. 
	 * @param string $limit 'limit' part of the query.
	 */
	function formQuery($task = "SELECT", $table, $fields, $wheres=array(), $orderby=array(), $limit ="") {
		
		$query = array(
			"tables" => array(), "t" => "", 
			"fields" => array(), "f" => "", 
			"values" => array(), "v" => "",
			"fieldValues" => array(), "fv" => "",
			"wheres" => array(), "w" => ""
		); 
		$executeVars = array();
		
		
		// Add Tables
		if(is_array($table)) {
			foreach($table as $t) {
				$query['tables'][] = $t[0] . 
									( empty($t[1] ) ? "" : " AS " . $t[1] ) . 
									( empty($t[2] ) ? "" : " ON " . $t[2] );
			}
		}
		else 
			$query['tables'][] = $table; 
			
			
		$query['t'] = implode(" LEFT JOIN ", $query['tables']); 	
		
		
		
		// Add Select Fields
		if(is_array($fields)) {
			
			foreach($fields as $k=>$item) {
				
				$f = "`" . str_replace( ".", "`.`", $k ) . "`"; 
				$v = ":" . str_replace(".", "_", $k);
				
				if(isset( $executeVars[$v] )){
					$v .= "s"; 
					$executeVars[ $v ] = $item;
				}
				else 
					$executeVars[ $v ] = $item; 
				
				$query['fields'][] = $f;
				$query['values'][] = $v;
				$query['fieldValues'][] = $f . " = " . $v;
			
			}
			
			$query['v'] = implode(", ", $query['values']); 
			$query['fv'] = implode(", ", $query['fieldValues']); 
		
		}
		
		elseif (is_string($fields)) {
			$query['fields'][] = empty($fields) ? "*" : $fields; 
		}
		
		$query['f'] = implode(", ", $query['fields']); 
		
		
		// Where Vars
		if(!empty($wheres)) {
			foreach($wheres as $w) {
				
				$tmp = "";
				
				if(!isset($w[2]))
					$w[2] = "="; 
				
				switch($w[2]) {
				
					case "like":
						$v = ":" . str_replace(".", "_", $w[0]); 
						
						if( isset($executeVars[ $v ]) )
							$v .= "s";
						
						$tmp = "`" . str_replace( ".", "`.`", $w[0] ) . "` " . strtoupper($w[2]) . "  " . $v;						
						$executeVars[ $v ] = "%" . $w[1] . "%"; 
						break; 
					
					case "in":
						if( count($w[1]) > 0 ) {
							$in = array();
							for( $i = 0; $i < count($w[1]); $i++ ){
								$v = ":" . str_replace(".","_", $w[0].$i);
								
								if( isset($executeVars[ $v ]) )
									$v .= "s"; 
									
								$in[] = $v;
								$executeVars[ $v ] = $w[1][$i]; 
								
							}
							$tmp = "`" . str_replace( ".", "`.`", $w[0] ) . "` IN( " . implode( ", ", $in) . " ) "; 
						}
						else $tmp = '';
						break; 
					
					case "not_in":
						if( count($w[1]) > 0 ) {
							$in = array();
							for( $i = 0; $i < count($w[1]); $i++ ){
								$v = ":" . str_replace(".","_", $w[0].$i);
								
								if( isset($executeVars[ $v ]) )
									$v .= "s"; 
									
								$in[] = $v;
								$executeVars[ $v ] = $w[1][$i]; 
								
							}
							$tmp = "`" . str_replace( ".", "`.`", $w[0] ) . "` NOT IN( " . implode( ", ", $in) . " ) "; 
						}
						else $tmp = "";
						break;
						
					case "having": 
						
						$v = ":" . str_replace(".", "_", $w[0][0]);
						if( isset($executeVars[ $v ]) ) $v .= "s";
						$tmp = "`" . str_replace( ".", "`.`", $w[0][0] ) . "` " . strtoupper($w[0][2]) . "  " . $v;						
						$executeVars[ $v ] = $w[0][1]; 
						
						$v = ":" . str_replace(".", "_", $w[1][0]);
						if( isset($executeVars[ $v ]) ) $v .= "s";
						$tmp .= " HAVING `" . str_replace( ".", "`.`", $w[1][0] ) . "` " . strtoupper($w[1][2]) . "  " . $v;						
						$executeVars[ $v ] = $w[1][1]; 
						
						break;
						
					case "decimal": 
						
						$v = ":" . str_replace(".", "_", $w[0]); 
						
						if( isset($executeVars[ $v ]) )
							$v .= "s";
						
						$tmp = "CAST( `" . str_replace( ".", "`.`", $w[0] ) . "` AS DECIMAL(10,2) ) =  CAST(" . $v . " AS DECIMAL(10,2) ) ";
						$executeVars[ $v ] = $w[1]; 
						
						break;
						
					default:
						$v = ":" . str_replace(".", "_", $w[0]); 
						
						if( isset($executeVars[ $v ]) )
							$v .= "s";
						
						$tmp = "`" . str_replace( ".", "`.`", $w[0] ) . "` " . strtoupper($w[2]) . "  " . $v;						
						$executeVars[ $v ] = $w[1]; 
						break; 
				}
				
				if( $tmp != '' ) $query['wheres'][] = $tmp; 
				
			}
			
			if (!empty($query['wheres']) )
				$query['w'] = " WHERE " . implode(" AND ", $query['wheres'] ); 
			
		}
		
		
		// Create task
		if( $task == "delete" ) 
			$q =  "DELETE FROM " . $query['t'] . $query['w'];
		
		elseif ( $task == "insert" )
			$q = "INSERT INTO " . $query['t'] . " ( " . $query['f'] . " ) VALUES ( " . $query['v'] . " ) "; 
				
		elseif ( $task == "update" )
			$q = "UPDATE " . $query['t'] . " SET " . $query['fv'] . $query['w']; 
		
		elseif ( $task == "distinct" )
			$q = "SELECT DISTINCT " . $query['f'] . " FROM " . $query['t'] . $query['w'];
		
		elseif ($task == "sum" )
			$q = "SELECT SUM(" . $query['f'] . ") FROM " . $query['t'] . $query['w'];
		
		elseif ($task == "count" )
			$q = "SELECT count(" . $query['f'] . ") FROM " . $query['t'] . $query['w'];
		
		else
			$q = "SELECT " . $query['f'] . " FROM " . $query['t'] . $query['w'];
			
		
		// Order By
		if( !empty( $orderby ) ) {
			if( count($orderby) > 1 && is_array( $orderby[1] ) ) {
				foreach($orderby AS $ok=>$order) $orderby[$ok] = implode(" ", $order);
				$q .= " ORDER BY " . implode( ", ", $orderby );
			}
			
			else 
				$q .= " ORDER BY " . $orderby[0] . " " . ( empty($orderby[1]) ? " ASC " : $orderby[1] ); 
			
		}
		
		// Limit
		if( !empty( $limit ) )
			$q .= " LIMIT " . $limit . " "; 
		
		// Return Query
		$q = str_replace("#__", $this->prefix, $q);
		//echo $q . "<br />"; 
		//printa($wheres); 
		//echo Html::printr( $executeVars ); 
		
		$this->last_query = array("q" => $q, "vars" => $executeVars);
		
		return $this->last_query; 
	
	}
	
	
	/**
	 * Raw MySQL query
	 * 
	 * @param string $query
	 * @param string $vars
	 * 
	 * @return bool
	 */
	function query($query, $vars = []) {
		
		try{
			$q = $this->pdo->prepare($query);
			$this->queries['query'][] = $query;
			 //file_put_contents('PDOErrors.txt', "QUERY: " . $query . "\nVARS: " . print_r( $vars, true), FILE_APPEND); 
			if ( $q->execute($vars) )
				return true;
		}
		
		catch(PDOException $e) {
			file_put_contents('PDOErrors.txt', $e->getMessage() . "\n", FILE_APPEND); 
			file_put_contents('PDOErrors.txt', date("Y-m-d H:i:s") . "\n" . $query . "\n", FILE_APPEND);  			
			file_put_contents('PDOErrors.txt', date("Y-m-d H:i:s") . "\n" . json_encode( $vars, JSON_PRETTY_PRINT ) . "\n", FILE_APPEND);  			
			return false; 
		}
		
		return false; 
	}

	
	/**
	 * Raw MySQL query
	 * 
	 * @param string $query 
	 * @param string $vars
	 * 
	 * @return array $data
	 */
	function queryData($query, $vars = []) {
		
		$query = str_replace("#__", $this->prefix, $query);
		
		//file_put_contents( 'queries.html', $query. "\r\n" . "<pre>" . print_r( $vars, true ) . "</pre>\r\n\r\n", FILE_APPEND ); 
		
		$data = array();
		$this->queries['queryData'][] = $query;
		try{
			$q = $this->pdo->prepare($query);
			// file_put_contents('PDOErrors.txt', $query . "\n" . json_encode( $vars, JSON_PRETTY_PRINT ) . "\n", FILE_APPEND); 
			if ( $q->execute($vars) ) {
				$q->setFetchMode(PDO::FETCH_ASSOC); 
				while($row = $q->fetch()) {  
					$data[] = $row; 
				}  
			}
		}
		
		catch(PDOException $e) {
			file_put_contents('PDOErrors.txt', $e->getMessage() . "\n", FILE_APPEND); 
			file_put_contents('PDOErrors.txt', date("Y-m-d H:i:s") . "\n" . $query . "\n", FILE_APPEND);  			
			file_put_contents('PDOErrors.txt', date("Y-m-d H:i:s") . "\n" . json_encode( $vars, JSON_PRETTY_PRINT ) . "\n", FILE_APPEND);  			
			return false; 
		}
		
		return $data;
	}
	
	
	
	/**
	 * Insert data 
	 * 
	 * @param string $table
	 * @param array $fieldValues
	 * 
	 * @return bool $q
	 */
	function insertData($table, $fieldValues) {			
		
		$sql = $this->formQuery("insert", $table, $fieldValues ); 
		$q = $this->query($sql['q'], $sql['vars']); 
		if($q) return $this->pdo->lastInsertId(); 
		return $q;
		
	}
	
	
	/**
	 * Read data from table
	 * 
	 * @param string $table table.
	 * @param string $fields fields.
	 * @param array $wheres 'where' part of the query.
	 * @param array $orderby 'order by' part of the query. 
	 * @param string $limit 'limit' part of the query.
	 * 
	 * @return array $data
	 */	
	function getData( $table, $fields="*", $wheres=array(), $orderby=array(), $limit ="" ){		
		
		$sql = $this->formQuery("select", $table, $fields, $wheres, $orderby, $limit);
		$data = $this->queryData($sql['q'], $sql['vars']);
		
		return $data;
	}
	
	
	
	/**
	 * Get Distinct
	 * 
	 * @param string $table table.
	 * @param string $fields fields.
	 * @param array $wheres 'where' part of the query.
	 * @param array $orderby 'order by' part of the query. 
	 * @param string $limit 'limit' part of the query.
	 * 
	 * @return array $data.
	 */
	function getDistinct( $table, $fields, $wheres=array(), $orderby=array(), $limit = "" ) {
		
		$sql = $this->formQuery("distinct", $table, $fields, $wheres, $orderby, $limit);
		
		$data = $this->queryData($sql['q'], $sql['vars']);
		
		return $data; 
	}
	
	
	/**
   * Get Distinct Array
   */
	function getDistinctFlat($table, $field, $wheres=array(), $orderby=array(), $limit = ""){

		$sql = $this->formQuery("distinct", $table, $field, $wheres, $orderby, $limit);
		$data = $this->queryData($sql['q'], $sql['vars']);

		$flat = [];
		if(empty($data)) return $flat;

		foreach($data as $item)
			if(!empty($item[$field]))
				$flat[] = $item[$field];
		return $flat;
	}


	/**
	 * Update data
	 * 
	 * @param string $table table.
	 * @param array $fieldValues
	 * @param array $wheres 'where' part of the query.
	 */	
	function updateData($table, $fieldValues=array(), $wheres=array()) {
	
		$sql = $this->formQuery("update", $table, $fieldValues, $wheres ); 
		return $this->query($sql['q'], $sql['vars']);
		
	}
	
	
	/**
	 * Delete data
	 * 
	 * @param string $table table.
	 * @param array $wheres 'where' part of the query.
	 */ 
	function deleteData($table, $wheres = array()) {
		
		$sql = $this->formQuery("delete", $table, "", $wheres ); 
		return $this->query($sql['q'], $sql['vars']); 
		
	}
	
	
	/**
	 * Last Insert ID
	 * @param string $table table.
	 */
	function getLastInsertID($table) {
		
		return $this->getVar($table, "LAST_INSERT_ID()");
	}
	
	
	/**
	 * Get Var
	 * 
	 * @param string $table table.
	 * @param string $fields fields.
	 * @param array $wheres 'where' part of the query.
	 * @param array $searchfields
	 * @param array $orderby 'order by' part of the query. 
	 * 
	 */
	function getVar($table, $field = "", $wheres=array(), $searchfields=array(), $orderby=array()) {
		
		$result = $this->getData($table, $field, $wheres, $searchfields, $orderby);
		
		if(!empty($result[0][$field])) {
			return $result[0][$field];
		} else {
			return 0;
		}
		
	}
	
	
	/**
	 * Get Row
	 * @param string $table table.
	 * @param string $fields fields.
	 * @param array $wheres 'where' part of the query.
	 * @param array $searchfields
	 * @param array $orderby 'order by' part of the query. 
	 * @param string $limit 'limit' part of the query.
	 */
	function getRow($table, $fields = "", $wheres=array(), $searchfields=array(), $orderby=array(), $limit ="") {
		
		$result = $this->getData($table, $fields, $wheres, $searchfields, $orderby, $limit);
		
		if(!empty($result[0])) {
			return $result[0];
		} else {
			return array();
		}
		
	}
	
	
	/**
	 * Get Instance
	 * 
	 * @return self::$instances[$client]
	 */
	function getInstance($client) {
		if(empty(self::$instances[$client])) {
			$instance = new Database();
			
			self::$instances[$client] = &$instance;
		}
		
		return self::$instances[$client];
	}
	
	
	/**
	 * Count Rows
	 * 
	 * @param string $table table.
	 * @param string $field fields.
	 * @param array $wheres 'where' part of the query.
	 * @param array $orderby 'order by' part of the query.
	 * @param string $limit 'limit' part of the array.
	 */	
	function numRows( $table, $fields="*", $wheres=array(), $orderby=array(), $limit ="" ){		
		
		$sql = $this->formQuery("count", $table, $fields, $wheres, $orderby, $limit);
		$q = $this->pdo->prepare($sql['q']);
		
		try{
			
			$rows = array( 0 ); 
			$this->queries['query'][] = $sql['q'];
			
			if ( $q->execute($sql['vars']) ) {
				$rows = $q->fetch(PDO::FETCH_NUM);
			}
		}
		
		catch(PDOException $e) {
			file_put_contents('PDOErrors.txt', $e->getMessage() . "\n", FILE_APPEND); 
			file_put_contents('PDOErrors.txt', date("Y-m-d H:i:s") . "\n" . json_encode( $q, JSON_PRETTY_PRINT ) . "\n", FILE_APPEND);  			
			file_put_contents('PDOErrors.txt', date("Y-m-d H:i:s") . "\n" . json_encode( $sql['vars'], JSON_PRETTY_PRINT ) . "\n", FILE_APPEND);  			
			return false; 
		}
		
		return $rows[0];
	}
	
	
	/**
	 * Force Close Connection
	 */
	function close() {
		
		$connection = $this->pdo;
		
		/**
		$query = 'SHOW PROCESSLIST -- ' . uniqid('pdo_mysql_close ', 1);
		$list  = $connection->query($query)->fetchAll(PDO::FETCH_ASSOC);
		foreach ($list as $thread) {
			if ($thread['Info'] === $query) {
				return $connection->query('KILL ' . $thread['Id']);
			}
		} */
		
		
		$this->pdo = NULL;
		$this->connected = false;
		return false;
		
	}
	
	/**
	 * Close Connection
	 * 
	 * Closes the connection
	 */
	function __destruct() {		
		$this->pdo = NULL;
		if($this->connected) {	
			$this->close();
		}
	}

}
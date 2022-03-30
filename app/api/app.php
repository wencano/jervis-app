<?php if(!defined("ACCESS")) die("Direct access not allowed."); 

/**
 * API Handler
 * 
 * Class App
 * 
 */
class App {
	
	public $db, $session, $users = array(), $user, $getRoutes = [], $postRoutes = [], $events, $request, $response, $headers = array(), $isApi;
	
	
	/**
	 * Constructor
	 * - set route
	 * - set session
	 * - set user
	 */
	public function __construct() {
		global $config, $db;
		
		$fullpath 			= $_SERVER['REQUEST_URI'];
		$root						= str_replace( 'index.php', '',  strtok( $_SERVER['SCRIPT_NAME'], '?' ) );
		$this->root 		= $root; 
		$this->path 		= str_replace( $root, '/', strtok( $fullpath, '?' ) );
		$this->params 	= explode("/", trim( $this->path, "/" ) );
		$this->config		= $config; 
		
		$this->method		= $_SERVER['REQUEST_METHOD'];
		$this->session_key = empty( $_REQUEST['session_key'] ) ? null : $_REQUEST['session_key'];
		$this->session 	= (object)array();
		$this->user 		= (object)array( "id" => 0, "name" => "Guest", "type" => "guest" );
		$this->db				= $db;
		$this->getdata 	= $_GET;
		$this->postdata = $_POST;
		$this->request = $_REQUEST;
		
				
		// Set Session User
		if( !empty( $this->session_key ) ) {
			
			$session = (object)$this->db->getRow( "#__sessions", "*", array( array( 'session_key', $this->session_key ) ) ); 
			
			// Find session
			// If session is found, set user and session data.
			if(!empty( $session->user_id ) ) {
				$this->session 	= $session;
				$this->user = (object)$this->db->getRow( '#__users', '*', array( array( 'id', $session->user_id ) ) );
				unset($this->user->pass);
				if(!empty($this->user->locations)) $this->user->locations = explode(",", $this->user->locations);
			}
		}
			
		
		// Set API
		$this->_allowXSS();
		$this->isApi = true;
		
		$this->getSettings();
		
	}
	
	/**
	 * Get Routes and Function/Component
	 * 
	 * Get function gets the value of the $callback from the $path through getRoutes. 
	 * 
	 * @param string $path the path that can be found in the list of routes available.
	 * @param string $callback returns the component being searched for.
	 * 
	 */
	public function get( $path, $callback ) {
		$this->getRoutes[ $path ] = $callback;
	}
	
	/**
	 * Routes Routes and Function/Component
	 * 
	 * Post function sets the value of the $callback depending on the value of the $path through postRoutes.
	 * 
	 * @param string $path the path that can be found in the list of routes available.
	 * @param string $callback returns the component being searched for.
	 */
	public function post( $path, $callback ) {
		$this->postRoutes[ $path ] = $callback;
	}
	
	
	/**
	 * Run 
	 * 
	 * Locates the $callback in the Get and Post lists. 
	 * Stores it into string $fn if found.
	 * 
	 * @return this->response if not found
	 */
	public function run() {
		global $timestart;

		$fn = '';
		
		// Find Callback in GET list
		if( $this->method == 'GET' && isset($this->getRoutes[ $this->path ]) )
			$fn = $this->getRoutes[ $this->path ];
		
		// Find Callback in POST list
		else if( $this->method == 'POST' && isset($this->postRoutes[ $this->path ]) )
			$fn = $this->postRoutes[ $this->path ];
		
		// Force Get
		else if( $this->method == 'GET' && isset($this->getdata['forceget']) && isset($this->postRoutes[ $this->path ]) )
			$fn = $this->postRoutes[ $this->path ];
		
		// If no callback is found
		if( empty( $fn ) ) {
			$this->response = [ 'error' => 'Component not found.', 'component' => $fn, 'route' => $this->path ];
		}
		
		else {
			
			if( is_callable( $fn ) ) $this->response = call_user_func( $fn );
			
			else {
				
				$className = $fn . "Controller";
				$fscontroller = FSCON . $fn . ".php";
				$fscomponent = FSCOM . $fn . "/index.php";

				// Load Controller
				if( file_exists( $fscontroller ) ) {
					include_once( $fscontroller );
					$this->response = $fn::getInstance()->run();
				}


				// Load Component
				else if( file_exists( $fscomponent ) ) {
					include_once( $fscomponent );
					$this->response = $className::getInstance()->run();
				}
				
				// Load Web App 
				else {
					
					$config = $this->config; 
					ob_start();
					require( FSROOT . "/tmpl.default.php" );
					$html = addslashes(ob_get_contents());
					ob_end_clean();
					
					$this->response = stripslashes( $html );
					
				}

			}
			
		}

		$timeend = microtime(true);
		if(is_object($this->response)) $this->response->global_timediff = ( $timeend - $timestart) * 1000; 
		else if ( is_array($this->response)) $this->response['global_timediff'] = ( $timeend - $timestart ) * 1000; 
		
		if( is_object($this->response) || is_array($this->response) ) $this->response = json_encode( $this->response );
		$this->_render();
		
	}


	/**
	 * Render
	 * 
	 * Set the headers and response
	 */
	protected function _render() {
		
		// Add Headers
		foreach($this->headers as $k=>$v) 
			header( $k . ": " . $v );
		
		// Output HTML
		echo $this->response; 
		//exit(0);
	}

	
	
	/**
	 * AJAX Cross Origin
	 */
	protected function _allowXSS() {
			$this->headers['Access-Control-Allow-Origin'] 	= empty( $_SERVER['HTTP_ORIGIN'] ) ? '' : $_SERVER['HTTP_ORIGIN'];
			$this->headers['Access-Control-Allow-Methods'] 	= "GET, POST, PUT";
			$this->headers['Access-Control-Max-Age'] 				= 1000;
			$this->headers['Access-Control-Allow-Headers']	= "Content-Type, Authorization, X-Requested-With";
			$this->headers['Access-Control-Allow-Credentials'] = 'true';
	}
	
	
	/**
	 * Upload
	 * 
	 * Function for uploading files.
	 * 
	 * @param array $file holds the filename of the file to be uploaded.
	 * @param string $dest the destination for where the file will be moved.
	 * 
	 * Sets the res->message according to whether or not the upload was succesful. The boolean res->success will be set to false if the upload was unsuccessful.
	 * @return object $res
	 */
	function upload($file, $dest = '') {
		
		$res = (object)array('success' => true, 'message' => 'Error uploading file.');
		
		// Check if no error
		if ($res->success) {
				if ( move_uploaded_file($file["tmp_name"], $dest)) {
						$res->message = "The file ". basename( $file["name"]). " has been uploaded.";
				} else {
						$res->message = "Sorry, there was an error uploading your file.";
						$res->success = false; 
				}
		}
		
		return $res; 
		
	}
	
	
	/**
	 * Check User
	 * 
	 * Checks if user exists.
	 */
	public static function hasUser() { return !empty( self::$user ); }
	
	
	/**
	 * Get Settings
	 * 
	 * Fetches the settings, converts it to object, and returns it.
	 * 
	 * @return array $settings
	 */
	public function getSettings() {
		
		$settingsDb = $this->db->getData( '#__settings' );
		$settingsDb = empty($settingsDb) ? [] : $settingsDb; 
		
		// Convert to Object
		$settings = [];
		foreach($settingsDb as $s) $settings[ $s['setting'] ] = $s['value'];
		
		$this->settings = $settings; 
		
		return $settings;
		
	}
	
	
}
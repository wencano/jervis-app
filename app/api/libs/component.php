<?php if(!defined("ACCESS")) die("Direct access not allowed."); 

/**
 * Component Parent Class 
 *
 * Component controllers can use this class to inherit some initializations. Follows singleton pattern to ensure only single instance is loaded
 */
class ComponentController {
 
	// Inherited from App
	public $config, $settings, $db, $session_key, $session, $user, $path, $params, $root;
	
	// Internal vars
	public $_name = "Component", $_task = "list", $_items, $_item, $res = ['success'=>false, 'message'=>''];
	public $_table = "", $_filters = [], $_wheres = [], $_fields = "", $_sort = [], $_limit = "";
	
	// Instance
	protected static $instance; 
	
	
	/**
	 * Parent constructor
	 *
	 * must be private !!! [very important],otherwise we can create new father instance in it's Child class
	 */
	private function __construct() {
		global $config, $settings, $app;
		
		
		$this->config = $config;
		$this->settings = $settings; 
		$this->db = $app->db;
		$this->session_key = $app->session_key;
		$this->session = $app->session;
		$this->user = $app->user;
		$this->path = $app->path;
		$this->params = $app->params;
		$this->root = $app->root;
		$this->getdata = !empty( $app->getdata ) ? $app->getdata : [];
		$this->postdata = !empty( $app->postdata ) ? $app->postdata : [];
		$this->request = !empty( $app->request ) ? $app->request : [];
		
		
		// Set Task
		$this->_task = !empty($app->params) && !empty($app->params[1]) ? $app->params[1] : 'list';
		
		// Filters
		$this->_filters = !empty($this->postdata['filters']) && is_array( $this->postdata['filters'] ) ? $this->postdata['filters'] : [];
		
		
		$this->res = (object)$this->res;
		
	}
	

	/**
	 * Singleton Instance Checker
	 */
	public static function getInstance() {
		#must use static::$instance ,can not use self::$instance,self::$instance will always be Father's static property 
		if (! static::$instance instanceof static) {
			static::$instance = new static();
		}
		return static::$instance;
	}
	

	
	/**
	 * Get $_GET Data
	 * 
	 * getQuery function searches from getData using the key and returns value depending to whatever condition it satisfies.
	 * 
	 * @param string $key used to search for the query
	 * @param string $default default value if not found
	 * 
	 * @return mixed|string return value from $_GET
	 */
	public function getQuery( $key = '', $default = '') {
		if(!empty($key)) {
			if(isset($this->getdata[$key])) return $this->getdata[$key];
			else return $default;
		}
		else return $this->getdata; 
	}
	
	
	/**
	 * Get $_POST Data
	 * 
	 * @param string $key 						POST array key
	 * @param	mixed|string	$default 	Default value if not found
	 * @return mixed|string 					Return value from $_POST
	 */
	public function getPost( $key = '', $default = '') {
		if(!empty($key)) {
			if(isset($this->postdata[$key])) return $this->postdata[$key];
			else return $default;
		}
		else return $this->postdata; 
	}
	
	
	/**
	 * Get $_REQUEST Data
	 * 
	 * @param string $key
	 * @param string $default default value if not found
	 * 
	 * @return mixed|string
	 */
	public function getRequest( $key = '', $default = '' ) {
		if(!empty($key)) {
			if(isset($this->request[$key])) return $this->request[$key];
			else return $default;
		}
		else return $this->request; 
	}
	
	/**
	 * Default Run Method
	 */
	public function run() {
		
		
		// Default (list)
		if( $this->_task == 'list' ) $task = 'getItems';
		
		// Get Item
		else if ($this->_task == 'item' ) $task = 'getItem';
		
		// Get Task
		else $task = $this->params[1];
		
		// Run Task
		$this->res = $this->$task();
		
		return $this->res; 
		
	}
	
	
	/**
	 * Access Control -- deny
	 * 
	 * Controls who can access depending on the user_type and their corresponding privileges.
	 * 
	 * @param array $user_type holds the type of the user who's granted access.
	 */
	public function isNot( $user_type ) { 
		if( is_array( $user_type ) ) return !in_array( $this->user->type, $user_type );
		else return $this->user->type != $user_type; 
	}
	/**
	 * Access Control -- confirm
	 * 
	 * Controls who can access depending on the user_type and their corresponding privileges.
	 * 
	 * @param array $user_type holds the type of the user who's granted access.
	 */
	public function is( $user_type ) { 
		$type = !empty( $this->user ) && !empty($this->user->type) ? $this->user->type : 'guest';
		if( is_array( $user_type ) ) return in_array( $type, $user_type );
		else return $type == $user_type; 
	}
	
	
	/**
	 * Technician Helpers -- Locations
	 * 
	 * Gets locations of the technicians.
	 * 
	 * @return array $location_ids.
	 */
	public function _getTechLocations ($user_id = 0) {
		$id = !$user_id ? $this->user->id : $user_id;
		$location_ids = [];
		
		// If current user
		if( !$user_id && !empty($this->user->locations) && !empty($this->user->location_ids) ) $location_ids = $this->user->location_ids; 
		
		// If other users
		else {
			
			$locations = $this->db->getData( 
				[['#__user_locations','ul'], ['#__locations','l','ul.location_id=l.id']], 
				'ul.*,l.city,l.state', 
				[['ul.tech_id', $id]], 
				[ ['l.city','asc'], ['l.state', 'asc'] ] 
			);
			
			$location_ids = Helpers::flatten( $locations, 'location_id' );
			
			$this->user->locations = $locations;
			$this->user->location_ids = $location_ids;
			
		}
		
		return $location_ids;
		
	}
	
	
	/**
	 * Technician Helpers -- Categories
	 * 
	 * Gets categories of the technicians.
	 * 
	 * @return array $category_ids.
	 */
	public function _getTechCategories ($user_id = 0) {
		$id = !$user_id ? $this->user->id : $user_id;
		$category_ids = [];
		
		// If current user
		if( !$user_id && !empty($this->user->categories) && !empty($this->user->category_ids) ) $category_ids = $this->user->category_ids; 
		
		// If other users
		else {
			
			$categories = $this->db->getData( 
				[['#__user_category','uc'], ['#__categories','c','uc.category_id=c.id']], 
				'uc.*,c.name', 
				[['uc.tech_id', $id]], 
				['c.name','asc'] 
			);
			
			$categories = empty($categories) ? [] : $categories; 
			
			$category_ids = Helpers::flatten( $categories, 'category_id' );
			
			$this->user->categories = $categories;
			$this->user->category_ids = $category_ids;
			
		}
		
		return $category_ids;
		
	}
	
	
	/**
	 * Technician Helpers -- Declined
	 * 
	 * Gets the projects declined by technicians.
	 * 
	 * @return array $projects_declined_ids.
	 */
	public function _getTechProjectsDeclined ($user_id = 0) {
		$id = !$user_id ? $this->user->id : $user_id;
		$projects_declined = [];
		
		// If current user
		if( !$user_id && !empty($this->user->projects_declined) && !empty($this->user->projects_declined) ) $projects_declined = $this->user->projects_declined; 
		
		// If other users
		else {
			
			$projects_declined_list = $this->db->getData( 
				'#__project_declined', 
				'id,project_id', 
				[['tech_id', $id]]
			);
			
			$projects_declined_list = empty($projects_declined_list) ? [] : $projects_declined_list; 
			
			$projects_declined_ids = Helpers::flatten( $projects_declined_list, 'project_id' );
			
			$this->user->projects_declined_list = $projects_declined_list;
			$this->user->projects_declined_ids = $projects_declined_ids;
			
		}
		
		return $projects_declined_ids;
		
	}
	

	
	/**
	 * Task: Default/List
	 *
	 * Lists all the data. 
	 * @param array $wheres 'where' part of the query.
	 */
	public function getItems( $wheres = [] ) {
		
		// Set Filter Query
		if( !empty($this->_wheres ) ) $wheres = $this->_wheres;
		
		// Set Filter Query from raw list
		else if( empty($wheres) && !empty($this->_filters) )
			foreach( $this->_filters as $field => $v )
				$wheres[] = [ $field, $v, 'like' ];
		
		// Get Simple List
		$this->res->items = $this->db->getData( $this->_table, $this->_fields, $wheres, $this->_sort, $this->_limit );
		$this->res->success = true;
		
		
		return $this->res;
	}

	
	/**
	 * Task: Edit
	 *
	 * Retrieve single record as well as associated data.
	 */
	public function getItem($id = 0, $wheres = []) {
		
		$id = !empty( $this->getdata['id'] ) ? $this->getdata['id'] : $id;
		$wheres = empty($wheres) ? [ ['id', $id] ] : $wheres;
		
		// Set Filter Query
		if( !empty($this->_wheres ) ) $wheres = $this->_wheres;
		
		// Set Filter Query from raw list
		else if( empty($wheres) && !empty($this->_filters) )
			foreach( $this->_filters as $field => $v )
				$wheres[] = [ $field, $v, 'like' ];
		
		// Get Item
		$this->res->item = $this->db->getRow( $this->_table, $this->_fields, $wheres );
		
		if(!empty($this->res->item)) $this->res->success = true;
		
		return $this->res;
	}
	
	
	/** 
	 * Task: Single
	 *
	 * Same as edit.
	 */
	public function single($id=0) {
		return $this->getItem($id);
	}
	 
	 
	/**
	 * Task: Update
	 *
	 * Insert/Update new data.
	 */
	public function update($id=0,$data=[]) {
		
		if( empty($data['id']) ) $data['id'] = $this->db->insertData( '#__users', $data );
		else $this->res->status = $this->db->updateData('#__users', $data, [ [ 'id', $data['id'] ] ] );
		
		$this->res->success = true;
		
		return $this->res;
	}
	
	
	/**
	 * Task: Upsert
	 *
	 * Same as update task.
	 */
	public function upsert($id=0, $data=[]) {
		return $this->update($id, $data);
	}

	
	/**
	 * Task: Remove / Delete
	 *
	 * Remove record(s).
	 * 
	 * @return mixed|string
	 */
	public function remove($id=0) {
		
		if( is_array( $id ) ) $this->res->status = $this->db->deleteData($this->_table, [ ['id', $id, 'in'] ] );
		else $this->res->status = $this->db->deleteData($this->_table, [ ['id', $id] ] );
		$this->res->success = true;
		
		return $this->res;
	}
	
	
	/**
	 * Clone Res 
	 */
	public function res() {
		return json_decode( json_encode( $this->res ) ); 
	}
	
	
	/**
	 * User Check
	 * 
	 * Checks the type of the user.
	 */
	public function hasUser() { return !empty($this->user) && !empty( $this->user->id ); }
	public function getUserType() { if( !empty($this->user) && !empty($this->user->type) ) return $this->user->type; return "guest";}
	public function isAdmin() { return $this->getUserType() === 'admin'; }
	public function isDispatcher() { return $this->getUserType() === 'dispatcher';  }
	public function isTechnician() { return $this->getUserType() === 'technician';}
	public function isGuest() { return $this->getUserType() === 'guest';}
	
	
	/**
	 * Restrict Clone
	 */
	final protected function __clone(){}
	
}

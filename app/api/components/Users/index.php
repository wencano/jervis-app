<?php if(!defined("ACCESS")) die("Direct access not allowed."); 

/**
 * Users Controller
 *
 */
class UsersController extends ComponentController {
	
	public $_name = "Users";
	public $_table = "#__users";
	
	
	/**
	 * Run
	 */
	public function run() {
		return parent::run();
		
	}
	
	
	/**
	 * Task: Default / List
	 */
	public function getItems( $filters = [] ) {
		
		$res = $this->res;
		
		// Verify User, error if guest or technician
		if($this->is('guest') || $this->is('technician')) return $res;
		
		// POST Data
		$sortDefault = ['by' => 'name', 'dir' => 'asc'];
		$filters 	= $this->getPost('filters', []);
		$sortPost 		= $this->getPost('sort', $sortDefault );
		$page 		= $this->getPost('page', [ "total" => 0, "pages" => 0, "current" => 0, "size" => 50 ]);
		
		
		// Verify Admin 
		if( $this->isAdmin() ||$this->isDispatcher() ) {
			
			// Filters
			$wheres = array();
			if(!empty($filters['name'])) 	$wheres[] = array( 'u.name', $filters['name'], 'like' );
			if(!empty($filters['email'])) $wheres[] = array( 'u.email', $filters['email'], 'like' );
			if(!empty($filters['type'])) 	$wheres[] = array( 'u.type', $filters['type'] );
			if(isset($filters['status']) && $filters['status'] != '') 	$wheres[] = array( 'u.status', $filters['status'] );
			
			if(!empty($filters['category_ids'])) {
				$tech_ids = $this->getTechIdsFromAllCategoryIds( $filters['category_ids'] );
				$wheres[] = array( 'u.id', $tech_ids, 'in' );
			}
			
			// Sort 
			if( $sortPost['by'] == 'num_projects' ) $sort = $sortDefault;
			else $sort = $sortPost;
			$sortQuery = [ $sort['by'], $sort['dir'] ];
			
			
			// Limit
			$limit = empty( $page['size'] ) ? '' : ( (int)$page['current'] * (int)$page['size'] ) . ", " . (int)$page['size'];
			
			$userIds = $this->db->getDistinct( 
				[
					["#__users", 'u']
				],
				"u.id", 
				$wheres,
				$sortQuery, 
				$limit
			);
			
			$userIds = Helpers::flatten( $userIds, 'id' );
			$this->res->last_query= $this->db->last_query; 
			
			if(!empty($userIds)) {
				
				$users = $this->db->getData( '#__users', '', [ ['id', $userIds, 'in'] ], $sortQuery );
				$users = empty($users) ? [] : $users; 
				
			}
			
			$users = empty($users) ? [] : $users; 
			$res->sort = $sortQuery;
			$res->users = $users;
			$res->filterParams = $this->_getFilterParams( $filters );
			$res->pageParams = $this->_getPageParams( $page, $wheres, $sortQuery );
			$res->page = $page;
			$res->success = true;
		}
		
		
		else $res->message = "Restricted area.";
		
		return $res;
			
		
	}
	
	
	/**
	 * Get Filter Params
	 * include locations
	 */
	public function _getFilterParams( $filters = '' ) {
		$res = [];
		
		return $res; 
		
	}
	
	
	/**
	 * Get Page Params
	 */
	public function _getPageParams( $page = [], $wheres = [], $sort = [] ) {
		
		$pageParams = $page;
		
		// Get Filtered Project IDs
		$itemIds = $this->db->getDistinct( 
			[
				["#__users", 'u']
			],
			"u.id", 
			$wheres,
			$sort
		);
		$numRows = count($itemIds);
		
		$pageParams['size'] = empty($page['size']) ? '' : (int)$page['size'];
		$pageParams['total'] = $numRows; 
		$pageParams['pages'] = !empty($pageParams['size']) ? ceil( $numRows / $pageParams['size'] ) : 1; 
		$pageParams['current'] = (int)$page['current'];
		
		return $pageParams;
		
	}
	
	
	/**
	 * Task: View Single User
	 */
	public function getItem($user_id = 0, $filters = []) {
		
		$res = $this->res;
		$res->success = true;
	
		$user_id = empty($this->postdata['id']) ? 0 : $this->postdata['id'];
		
		// Get User
		if(!empty($user_id)) {
			
			$user_id = empty($user_id) ? $this->user->id : $user_id; 
			
			$user	= $this->db->getRow('#__users', '*', [['id', $user_id]] );
			
			if( !empty($user) ) {
				// Return User
				$user['pass'] = '';
				$res->user = $user;
			}
			
			else {
				$res->success = false;
				$res->message = "User not found.";
			}
		}
		
		$res->filterParams = $this->_getFilterParams();
		
		return $res;
		
		
	}
	
	
	/**
	 * Internal Get Locations 
	 */
	public function _getLocationsByUserId( $user_id = 0 ) {
		$locations = [];
		
		$locations = $this->db->getData( 
			[
				['#__locations', 'loc'],
				['#__user_locations', 'ul', 'loc.id=ul.location_id']
				
			], 
			'loc.*, CONCAT(loc.city, ", ", loc.state) AS location_name,ul.tech_id, ul.id AS user_location_id, ul.id AS ul_id, ul.address_street, ul.address_city, ul.address_zip ', 
			[ ['ul.tech_id', $user_id] ],
			['loc.city', 'asc']
		);
		
		if(!empty($locations)) {
			
			// Count Projects
			foreach($locations as $k=>$loc ) {
				$locations[$k]['num_projects'] = $this->db->numRows( '#__projects', 'id', [[ 'location_id', $loc['id']], ['tech_id', $user_id]] );
				$locations[$k]['last_query'] = $this->db->last_query; 
			}
		}
		
		return empty( $locations ) ? [] : $locations; 
		
	}
	
	
	/**
	 * Get Categories by User Id
	 */
	public function _getCategoriesByUserId( $user_id = 0 ) {
		
		$categories = $this->db->getData( 
			[
				['#__categories', 'cat'],
				['#__user_category', 'ucat', 'cat.id=ucat.category_id']
				
			], 
			'cat.*, ucat.tech_id, ucat.id AS user_category_id, ucat.id AS uc_id ', 
			[ ['ucat.tech_id', $user_id] ],
			['cat.name', 'asc']
		);
		
		return empty( $categories ) ? [] : $categories; 
		
	}
	
	
	
	/**
	 * Update User Profile
	 */
	public function update($id = 0, $data = []) {
		$res = $this->res;
		
		$task 		= $this->postdata['task'];
		$userdata = (object)$this->postdata['data'];
		$res->task = $task; 
		$uid = $userdata->id;
		$user = (object)[];
		
		// Find User
		$user = (object)$this->db->getRow( "#__users", '*', array( array( 'id', $uid ) ) ); 
		
		// Validate If User if Found
		if( empty( $user->id ) ) {
			$res->message = "User not found.";
			return $res;
		}
		
		// Task - Update Profile
		if( $task == 'profile' ) {
			
			$user->name_first = $userdata->name_first;
			$user->name_last	= $userdata->name_last;
			$user->name				= $userdata->name_first . " " . $userdata->name_last;
			$user->email			=	$userdata->email;
			$user->timezone		= empty( $userdata->timezone ) ? 'America/New_York' : $userdata->timezone;
			
			// Process Photo
			
		}
		
		// Task - Update Password
		else if ( $task == 'password' ) {
			$user->pass				= md5( $userdata->password );
		}
		
		// Save to Database
		$this->db->updateData( "#__users", (array)$user, array( array( 'id', $user->id ) ) ); 
		
		$res->success		= true;
		$res->user 			= $user;
		
		return $res;
	}
	
	
	/**
	 * Insert/Update User (by Admin)
	 */
	public function upsert($id=0, $data=[]) {
		
		$res = $this->res();
		$data = empty($data) ? $this->getPost( 'data', [] ) : $data;
		
		if(!empty($data)) {
			
			$data['name'] = $data['name_first'] . ( empty($data['name_last'])?'' : ' ' . $data['name_last'] );
			
			$origPass = $data['pass']; 
			if(!empty($data['pass'])) $data['pass'] = md5( $data['pass'] );
			else unset($data['pass']);
			unset($data['pass_confirm']);
			
			// Locations Data
			$locations = [];
			if(isset($data['locations'] )) $locations = $data['locations'];
			unset($data['locations']);
			
			// Categories Data
			$categories = [];
			if(isset($data['categories'])) $categories = $data['categories'];
			unset($data['categories']);
			
			// Verify Email
			$wheresVerify = [ ['email',$data['email']] ];
			if( $data['id'] != 'new' && $data['id'] != '' )  $wheresVerify[] = ['id', $data['id'], '!='];
			$userExists = $this->db->getRow( '#__users', 'id', $wheresVerify );
			if(!empty($userExists)) {
				$res->message = "The email address is already used by another user.";
				return $res; 
			}
			

			// Unset Unnecessary Data
			unset( 
				$data['num_accepted'],
				$data['num_dispatched'],
				$data['num_completed']
			);


			// Insert
			$task = 'add';
			if($data['id'] == 'new') {
				unset($data['id']);
				$data['date_created'] = date("Y-m-d H:i:s");
				$data['hourly_rate_start'] = empty( $data['hourly_rate'] ) ? 0 : $data['hourly_rate'];
				
				$data['id'] = $this->db->insertData( '#__users', $data );
			}
			
			// Update
			else {
				$task = 'update';
				$data['date_modified'] = date("Y-m-d H:i:s");
				if( $data['hourly_rate_start'] == 0 && !empty($data['hourly_rate']) ) $data['hourly_rate_start'] = $data['hourly_rate'];
				$this->db->updateData( '#__users', $data, array( array( 'id', $data['id'] ) ) );
			}
			
			// Upsert Location and Categories for Technicians
			if( $data['type'] == 'technician' ) {
				$this->_assignLocation( $data, $locations );
				$this->_assignCategories( $data, $categories );
			}
			
			if( !empty($data['status']) && $data['status'] == -1) $task = "signup";
			
			$res = (object)array(
				"success" => true,
				"user" => $data
			);
			
			
			// Notify Dispatchers
			if( $task == 'add' && ( $this->is('admin') ) ) {
				
				// Notify Added User
				$message = $this->settings['add_user_notif'];
				$message = str_replace( ['[User_First_Name]', '[User_Email]', '[User_Pass]'], [ $data['name'], $data['email'], $origPass ], $message );
				Notifier::sendEmail( $data, [ 'subject' => 'PowersIoT Tech Scheduling - Account Details', 'message' => nl2br( $message ) ] );
				
				// Notify Admins
				$subject = "<b>" . $this->user->name . "</b> added new " . ucwords( $data['type'] ) . ": <b>" . $data['name'] . "</b>.";
				$message = $this->_composeEmailUserInfo( $data );
				
				Logger::toLog( $this->user->id, 'users', $data['id'], 'add', $subject );
				Notifier::toAdmins( $this->user->id, 'users', $data['id'], 'add', nl2br( $message ), 'all', $subject );
				
			}
			
			else if ( $task == 'signup' ) {
				
				// Notify New User
				$message = $this->settings['signup_user_notif'];
				$message = str_replace( ['[User_First_Name]', '[User_Email]' ], [ $data['name'], $data['email'] ], $message );
				Notifier::sendEmail( $data, [ 'subject' => 'PowersIoT Tech Scheduling Registration Confirmation', 'message' => nl2br( $message ) ] );
				
				// Notify Admins
				$subject = "New Technician Application";
				$message = $this->_composeEmailUserInfo( $data );
				$message .= "\n\n<a href='" . $this->config->admin . "users/" . $data['id'] . "/'>Click here to Approve/Disapprove</a>";
				
				Notifier::toAdmins( $this->user->id, 'users', $data['id'], 'add', nl2br( $message ), 'all', $subject );
				
			}
			
			
			
		}
		
		return $res;
		
	}
	
	
	/**
	 * Assign Locations
	 */
	public function _assignLocation($user, $locations ) {
		
		// Get Location IDs
		$assignedLocationIds = [];
		foreach($locations as $loc) 
			if(!empty( $loc['ul_id'] ) && $loc['ul_id'] != 'new') 
				$assignedLocationIds[] = $loc['ul_id'];
		
		// Remove Excluded Location IDs
		$delete = $this->db->deleteData( '#__user_locations', [ ['id', $assignedLocationIds, 'not_in'], ['tech_id', $user['id'] ]] );
		
		// Insert New Location IDs
		foreach($locations as $loc) {
			
			$ul_loc = [
				'tech_id'=>$user['id'], 
				'location_id' => $loc['id'],
				'address_street' => empty($loc['address_street']) ? "" : $loc['address_street'],
				'address_city' => empty($loc['address_city']) ? "" : $loc['address_city'],
				'address_zip' => empty($loc['address_zip']) ? "" : $loc['address_zip'],
				'address_state' => empty($loc['address_state']) ? "" : $loc['address_state'],
			];
			
			// Insert Location
			if( !empty( $loc['ul_id'] ) && $loc['ul_id'] == 'new' ) $this->db->insertData( '#__user_locations', $ul_loc );
			
			// Update Location
			else if ( !empty($loc['ul_id']) && $loc['ul_id'] != 'new' ) $this->db->updateData( '#__user_locations', $ul_loc, [ ['id', $loc['ul_id'] ] ] );
			
		}
		
	}
	
	
	/**
	 * Assign Categories
	 */
	public function _assignCategories($user, $categories ) {
		
		// Get User Category IDs
		$assignedCategoryIds = [];
		foreach($categories as $cat) 
			if(!empty( $cat['uc_id'] ) && $cat['uc_id'] != 'new') 
				$assignedCategoryIds[] = $cat['uc_id'];
		
		// Remove Excluded Category IDs
		$delete = $this->db->deleteData( '#__user_category', [ ['id', $assignedCategoryIds, 'not_in'], ['tech_id', $user['id'] ]] );
		
		// Insert New Category IDs
		foreach($categories as $cat) 
			if( !empty( $cat['uc_id'] ) && $cat['uc_id'] == 'new' )
				$this->db->insertData( '#__user_category', ['tech_id'=>$user['id'], 'category_id' => $cat['id'] ] );
		
	}
	
	
	/**
	 * Compose Message from User Info
	 */
	public function _composeEmailUserInfo( $data = [] ) {
		$message = "<b>Account Details</b>\n\n";
		$message .= "<b>Name:</b> " . $data['name'] . "\n";
		$message .= "<b>Email:</b> " . $data['email'] . "\n";
		$message .= "<b>Phone:</b> " . ( empty( $data['phone'] ) ? '' : $data['phone'] ) . "\n\n";
		$message .= "<b>Notes: </b> " . ( empty( $data['notes'] ) ? '' : $data['notes'] ) . "\n\n";
		
		return $message; 
	}
	
	
	
	/**
	 * Signup 
	 */
	public function signup( ) {
		
		$res = $this->res();
		
		$data = $this->getPost('data');
		
		// Verify Data
		if(empty($data)) {
			$res->message = "There was an error processing your request. Please try again later.";
			return $res; 
		}
		
		// Verify Exists		
		$emailExists = $this->db->getRow('#__users', 'id', [ ['email', $data['email'] ] ] );
		if(!empty($emailExists )) {
			$res->message = "User already exists. Please try a different email address.";
			return $res; 
		}
		
		$data['id'] = "new";
		$data['status'] = -1; 
		$res = $this->upsert( null, $data );
		
		return $res;
		
	}
	
	
	/**
	 * Approve
	 */
	public function approve() {
		$res = $this->res();
		
		$userId = $this->getPost('user_id');
		$approve = $this->getPost('approve');
		
		if(empty($userId)) return $res;
		
		$data = $this->db->getRow( '#__users', '', [['id', $userId]] );
		if(empty($data)) return $res; 
		
		// Approved
		if($approve == 1) {
		
			// Notify Added User
			$message = $this->settings['signup_user_approved'];
			$message = str_replace( ['[User_First_Name]', '[User_Email]' ], [ $data['name'], $data['email'] ], $message );
			Notifier::sendEmail( $data, [ 'subject' => 'PowersIoT Tech Scheduling Application Approved', 'message' => nl2br( $message ) ] );
			
			// Notify Admins
			$subject = "<b>[author_name]</b> approved new " . ucwords( $data['type'] ) . " <b>" . $data['name'] . "</b>.";
			$message = $this->_composeEmailUserInfo( $data );
			
			Logger::toLog( $this->user->id, 'users', $data['id'], 'approve', $subject );
			Notifier::toAdmins( $this->user->id, 'users', $data['id'], 'approve', nl2br( $message ), 'all', $subject );
		
			$this->db->updateData('#__users', [ 'status' => 1 ], [ ['id', $userId] ] );
			$res->success = true;
		}
		
		// Disapproved
		else {
			
			// Notify Added User
			$message = $this->settings['signup_user_disapproved'];
			$message = str_replace( ['[User_First_Name]', '[User_Email]' ], [ $data['name'], $data['email'] ], $message );
			Notifier::sendEmail( $data, [ 'subject' => 'PowersIoT Tech Scheduling Application Disapproved', 'message' => nl2br( $message ) ] );
			
			// Notify Admins
			$subject = "<b>[author_name]</b> disapproved new " . ucwords( $data['type'] ) . " <b>" . $data['name'] . "</b>.";
			$message = $this->_composeEmailUserInfo( $data );
			
			Logger::toLog( $this->user->id, 'users', $data['id'], 'disapprove', $subject );
			Notifier::toAdmins( $this->user->id, 'users', $data['id'], 'disapprove', nl2br( $message ), 'all', $subject );
			
			$this->db->deleteData( '#__user_category', [ ['tech_id', $userId] ] );
			$this->db->deleteData( '#__user_locations', [[ 'tech_id', $userId ] ] );
			$this->db->deleteData( '#__users', [ ['id', $userId] ] );
			
			$res->success = true;
			
		}
		
		
		return $res; 
		
	}
	
	
	/**
	 * Task: Remove
	 */
	public function remove($id =0){
		$res = $this->res;
		
		// Validate ID
		$id = $this->getPost('id');
		if(empty($id)) {
			$res->message = "User ID was not found.";
			return $res;
		}
		
		// Validate User has no projects on record
		$user_projects = $this->db->getData( '#__projects', '', [[ 'tech_id', $id] ] );
		if(!empty($user_projects)) {
			$res->message = 'Unable to delete. The user has existing assigned projects. Try putting his/her user account into INACTIVE instead to disable their access.';
			return $res; 
		}
		
		else {
			$this->db->deleteData( '#__users', [ ['id', $id] ] );
			$res->success = true; 
		}
		
		return $res;
		
	}
	
}
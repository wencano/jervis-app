<?php if(!defined("ACCESS")) die("Direct access not allowed."); 

/**
 * Notifications Controller
 *
 */
class NotificationsController extends ComponentController {
	
	public $_name = "Notifications";
	public $_table = "#__notifications";
	
	
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
		
		// Validate User
		if($this->is('guest')) return $res;
		
		// Filters
		$wheres = [ ['recipient_id', $this->user->id] ];
		$filters = $this->getPost('filters', []);
		$res->last_query = $this->db->last_query;
		
		
		// Limit
		$limit = $this->getPost('limit', -1 );
		$limit = "0, " . $limit; 
		
		// Get Notifications
		$notifications = $this->db->getData( 
			'#__notifications',
			'',
			$wheres,
			['date_created', 'desc' ],
			$limit
		);
		
		
		$res->notifications = $notifications; 
		$res->last_query = $this->db->last_query;
		$res->success = true; 
		
		return $res;
	}
	
	
	/**
	 * Task: Unread
	 * 
	 * Marks a notification as unread
	 */
	public function unread() {
		
		$res = $this->res();
		
		// Validate User
		if($this->is('guest')) return $res;
		
		// Filters
		$wheres = [ ['recipient_id', $this->user->id], ['date_read', '0000-00-00 00:00:00'] ];
		
		// Get Notifications
		$notifications = $this->db->getData( 
			'#__notifications',
			'',
			$wheres,
			['date_created', 'desc' ]
		);
		
		
		$res->notifications = $notifications; 
		$res->last_query = $this->db->last_query;
		$res->success = true; 
		
		return $res;
		
	}
	
	
	/**
	 * Task: Mark Read
	 * 
	 * Marks the notification as read.
	 */
	public function read( $all = false ) {
		
		$res = $this->res();
		
		// Validate User
		if($this->is('guest')) return $res; 
		
		$id = $this->getPost('id', 0);
		
		// Validate ID
		if(empty($id)) return $res; 
		
		// Mark Read
		$update = [ 'date_read' => date("Y-m-d H:i:s") ];
		$this->db->updateData('#__notifications', $update, [[ 'id', $id ], ['recipient_id', $this->user->id ]] );
		
		$res->success = true; 
		
		return $res; 
		
	}
	
	
	/**
	 * Read All
	 * 
	 * Marks all notifications as read.
	 */
	public function readall() {
		$res = $this->res();
		if($this->is('guest')) return $res; 
		
		// Read All
		$update = [ 'date_read' => date("Y-m-d H:i:s") ];
		$this->db->updateData('#__notifications', $update, [['recipient_id', $this->user->id ]] );
		
		$res->success = true;
		return $res; 
	}
	
	
	
	
}
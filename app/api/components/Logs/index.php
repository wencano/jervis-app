<?php if(!defined("ACCESS")) die("Direct access not allowed."); 

/**
 * Logs Controller
 *
 */
class LogsController extends ComponentController {
	
	public $_name = "Logs";
	public $_table = "#__logs";
	
	
	/**
	 * Run
	 */
	public function run() {
		return parent::run();
		
	}
	
	
	/**
	 * Get Dispatcher IDs
	 * 
	 * Gets ID of dispatchers.
	 */
	public function _getDispatcherIds() {
		
		$dispatchers = $this->db->getData('#__users', 'id', [ ['type', 'dispatcher']] );
		return Helpers::flatten($dispatchers, 'id');
		
	}
	
	
	/**
	 * Get Technicians 
	 * 
	 * Returns the information on technicians that are available to pick up the task, decided according to locations.
	 */
	public function _getTechnicians( $filters ) {
		
		$wheres = [ ['type', 'technician'] ];
		if(!empty($filters['location_id'])) $wheres[] = ['ul.location_id', $filters['location_id'] ];
		
		$technicians = $this->db->getData(
			[ 
				['#__users','u'],
				['#__user_locations', 'ul', 'ul.tech_id=u.id' ]
			],
			"u.*",
			$wheres
		);
		
		return $technicians;
		
	}
	
	
	/**
	 * Get Projects 
	 * 
	 * Returns available projects based on provided location.
	 */
	public function _getProjects( $filters ) {
		
		$wheres = [];
		
		if($this->is('technician')) $wheres[] = ['p.tech_id', $this->user->id];
		
		if(!empty($filters['location_id'])) $wheres[] = ['p.location_id', $filters['location_id'] ];
		
		$projects = $this->db->getData(
			[ 
				['#__projects','p']
			],
			"p.*",
			$wheres
		);
		
		return $projects;
		
	}
	
	
	/**
	 * Get Logs
	 */
	public function _getLogs( $wheres ) {
		
		// Get Logs
		$logs = $this->db->getData( 
			[ ['#__logs','l'] ],
			'l.*', 
			$wheres
		);
		
		$logs = empty($logs) ? [] : $logs;
		
		return $logs; 
	}
	
	
	
	/**
	 * Task: Default / List
	 */
	public function getItems( $filters = [] ) {
		
		$res = $this->res();
		$wheres = [];
		
		// Limit to Guest
		if($this->is('guest')) return $res;
		
		// Filters
		$filters = empty($filters) ? $this->getPost('filters', []) : $filters;
		$component = empty( $filters['component'] ) ? '' : $filters['component'];
		$item_id = empty($filters['item_id']) ? 0 : $filters['item_id'];
		
		$filterByIds = $this->_getDispatcherIds();
		$filterByIds[] = $this->user->id;
		
		// Default to User logs
		if(empty($filters)) $wheres[] = [ 'l.author_id', $this->user->id ];
		
		// Filter by Component
		if(!empty($component)) $wheres[] = [ 'l.component', $component ];
		if(!empty($item_id)) $wheres[] = ['l.item_id', $item_id];
		
		// Include Dispatcher Actions for Technician Views
		if( $this->is('technician') ) $wheres[] = ['l.author_id', $filterByIds, 'in'];
		
		// Filter for User Component
		if(!empty($filters['user_id'])) $wheres[] = ['l.author_id', $filters['user_id']];
		
		
		$logs = $this->_getLogs($wheres);
		
		// Location Component 
		if( $component == 'locations' && !empty($item_id) ) {
			
			// Include Projects
			
			$projects = $this->_getProjects( [ 'location_id' => $item_id ] );
			$projectIds = Helpers::flatten($projects, 'id');
			if(!empty($projectIds) ) {
				$wheres = [ [ 'l.component', 'projects'], ['l.item_id', $projectIds, 'in'] ];
				if( $this->is('technician') ) $wheres[] = ['l.author_id', $filterByIds, 'in'];
				$logs2 = $this->_getLogs($wheres);
				if(!empty($logs2)) $logs = array_merge($logs, $logs2);
			}
		}
		
		
		
		$res->logs = $logs; 
		$res->success = true;
		
		return $res;
	}
	
	
	
	
	
}
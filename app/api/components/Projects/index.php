<?php if(!defined("ACCESS")) die("Direct access not allowed."); 

/**
 * Projects Controller
 *
 */
class ProjectsController extends ComponentController {
	
	public $_name = "Projects";
	public $_table = "#__projects";
	
	
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
		
		// POST Data
		$filters 	= $this->getPost('filters', []);
		$sort 		= $this->getPost('sort', ['by' => 'project_id', 'dir' => 'desc'] );
		$page 		= $this->getPost('page', [ "total" => 0, "pages" => 0, "current" => 0, "size" => 50 ]);
		
		
		// Get Filters
		$wheres = [];
		if(isset($filters['id']))					$wheres[] = ['p.id', $filters['id'], 'like'];
		if(!empty($filters['customer_name']))					$wheres[] = ['p.customer_name', $filters['customer_name'], 'like'];
		if(!empty($filters['title']))					$wheres[] = ['p.title', $filters['title'], 'like'];
	
		// Sort
		$sort['by'] = strpos( $sort['by'], '.' ) > -1 ? $sort['by'] : "p." . $sort['by'];
		$sort = [ $sort['by'], $sort['dir'] ];
		
		// Limit
		$limit = empty( $page['size'] ) ? '' : ( (int)$page['current'] * (int)$page['size'] ) . ", " . (int)$page['size'];
		
		// Get Projects
		$projects = $this->db->getData( 
			[ ['#__projects', 'p'] ],
			'p.*', 
			$wheres,
			$sort,
			$limit
		);
		
		$res->success = true;
		$res->projects = empty( $projects ) ? [] : $projects;
		$res->pageParams = $this->_getPageParams( $page, $wheres, $sort );
		
		return $res;
		
	}
	
	
	/**
	 * Get Page Params
	 */
	public function _getPageParams( $page = [], $wheres = [], $sort = [] ) {
		
		$pageParams = $page;
		
		// Get Filtered Project IDs
		$numRows = (int)$this->db->numRows( 
			[ ['#__projects', 'p'] ],
			'p.id', 
			$wheres,
			$sort
		);
		
		$pageParams['size'] = empty($page['size']) ? '' : (int)$page['size'];
		$pageParams['total'] = $numRows; 
		$pageParams['pages'] = !empty($pageParams['size']) ? ceil( $numRows / $pageParams['size'] ) : 1; 
		$pageParams['current'] = (int)$page['current'];
		
		return $pageParams;
		
	}

	/**
	 * Item
	 */
	public function getItem( $id = 0, $wheres = []) {
		$res = $this->res();
		if( empty($id) ) $id = $this->getRequest('id', 0 );

		$res->id = $id; 
		
		// Validate ID
		if(empty($id)) return $res; 
		
		$wheres = [];
		$wheres[] = [ 'p.id', $id ];

 		// Machine
		$project	= $this->db->getRow(
			array(
				array( "#__projects", 'p' ),
			),
				'p.*',
			$wheres
		);

		$res->success = !empty($project); 
		$res->project = $project;
		return $res;
	}


/**
	 * Update/Insert
	 */
	public function upsert($id=0, $project=[]) {
		$res = $this->res();
		
		if(empty($project))
			$project = $this->getPost('project', []);
		
		
		// Validate Project
		if(!empty($project)){

			unset(
				$project['edit']
			);

			// Insert Project
			if(empty($project['id']) || $project['id'] == 'new') {
				$project['id'] = $this->db->insertData('#__projects', $project);
			}

			// Update Project Values
			else {
				$this->db->updateData('#__projects', $project, [ ['id', $project['id'] ] ] );
			}

			$res->project = $this->getItem($project['id'])->project;
			$res->success = true; 
		}
		return $res; 
	}

	/**
	 * Remove
	 */
	public function remove($id=0) {
		$res = $this->res();

		$id = $this->getPost('id', 0);

		if(!empty($id)) {
			$this->db->deleteData( '#__projects', [ ['id', $id] ] );
		}
		
		$res->success = true; 
		
		return $res;
	}

}
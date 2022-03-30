<?php if(!defined("ACCESS")) die("Direct access not allowed."); 

/**
 * Issues Controller
 *
 */
class IssuesController extends ComponentController {
	
	public $_name = "Issues";
	public $_table = "#__issues";
	
	
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
		$sort 		= $this->getPost('sort', ['by' => 'issue_id', 'dir' => 'desc'] );
		$page 		= $this->getPost('page', [ "total" => 0, "pages" => 0, "current" => 0, "size" => 50 ]);
		
		
		// Get Filters
		$wheres = [];
		if(!empty($filters['project_id']))					$wheres[] = ['i.project_id', $filters['project_id'], 'like'];
		if(isset($filters['version_id']))					$wheres[] = ['version_id', $filters['version_id'], 'like'];
		if(!empty($filters['issue']))					$wheres[] = ['i.name', $filters['issue'], 'like'];
		if(!empty($filters['issue']))					$wheres[] = ['i.description', $filters['issue'], 'like'];
		if(!empty($filters['status']))					$wheres[] = ['i.status', $filters['status'], 'like'];
	
		// Sort
		$sort['by'] = strpos( $sort['by'], '.' ) > -1 ? $sort['by'] : "i." . $sort['by'];
		$sort = [ $sort['by'], $sort['dir'] ];
		
		// Limit
		$limit = empty( $page['size'] ) ? '' : ( (int)$page['current'] * (int)$page['size'] ) . ", " . (int)$page['size'];
		
		// Get Issues
		$issues = $this->db->getData( 
			[ ['#__issues', 'i'], ['#__projects', 'p', 'p.id=i.project_id'] ],
			'i.*, CONCAT( p.code, "-", i.project_issue_id ) as issue_id', 
			$wheres,
			$sort,
			$limit
		);
		
		// Filter Params
		$filterParams = [];
		$filterParams['projects'] = $this->db->getData('#__projects');

		$res->success = true;
		$res->issues = empty( $issues ) ? [] : $issues;
		$res->filterParams = $filterParams;
		$res->pageParams = $this->_getPageParams( $page, $wheres, $sort );
		
		return $res;
		
	}
	
	
	/**
	 * Get Page Params
	 */
	public function _getPageParams( $page = [], $wheres = [], $sort = [] ) {
		
		$pageParams = $page;
		
		// Get Filtered Issue IDs
		$numRows = (int)$this->db->numRows( 
			[ ['#__issues', 'i'] ],
			'i.id', 
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
		$wheres[] = [ 'i.id', $id ];

 		// Machine
		$issue	= $this->db->getRow(
			array(
				array( "#__issues", 'i' ),
			),
				'i.*',
			$wheres
		);

		$res->success = !empty($issue); 
		$res->issue = $issue;
		return $res;
	}


/**
	 * Update/Insert
	 */
	public function upsert($id=0, $issue=[]) {
		$res = $this->res();
		
		if(empty($issue))
			$issue = $this->getPost('issue', []);
		
		
		// Validate Issue
		if(!empty($issue)){

			unset(
				$issue['edit']
			);

			// Insert Issue
			if(empty($issue['id']) || $issue['id'] == 'new') {
				$issue['id'] = $this->db->insertData('#__issues', $issue);
			}

			// Update Issue Values
			else {
				$this->db->updateData('#__issues', $issue, [ ['id', $issue['id'] ] ] );
			}

			$res->issue = $this->getItem($issue['id'])->issue;
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
			$this->db->deleteData( '#__issues', [ ['id', $id] ] );
		}
		
		$res->success = true; 
		
		return $res;
	}

}
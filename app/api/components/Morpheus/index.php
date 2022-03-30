<?php if(!defined("ACCESS")) die("Direct access not allowed."); 
/**
 * Morpheus Controller
 *
 */
class MorpheusController extends ComponentController {
	
	public $_name = "Morpheus";
	public $_table = "#__morpheus";
	
	
	/**
	 * Get Items (Default)
	 */
	public function getItems( $wheres = [] ) {
			
		$res = (object)array( "success" => false, "message" => "" );
		$filters 	= empty($_POST['filters']) ? array() : $_POST['filters'];
    $page			=	empty($_POST['page']) ? array( 'current' => 0, 'size' => 100 ) : $_POST['page'];
    
    // Morpheus
		$where = array();
		if(!empty($filters['title'])) $where[] = array( 'n.title', $filters['title'], 'like' );
		

		$limit = "";
		$limit = empty( $page['size'] ) ? '' : ( (int)$page['current'] * (int)$page['size'] ) . ", " . (int)$page['size'];
		$components = $this->db->getData(
			array(
				array('#__morpheus', 'm')
			),
			'm.*',
			$where,
			array( 'm.id', 'asc' ),
			$limit
		);
		$res->components = $components;

		// Pagination
		$dataTotal = $this->db->numRows( 
			array(
				array('#__morpheus', 'm')
			),
			'm.*',
			$where,
			array( 'm.id', 'asc' )		
		);
		$res->page = array( 
			'total' => $dataTotal,
			'pages' => (int) $dataTotal / ( empty( $page['size'] ) ? 1 : $page['size'] ), 
			'limit' => $limit
		);
		
		$res->success = true;
		return $res;
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
		$wheres[] = [ 'm.id', $id ];

 		// Morpheus Component
		$component	= $this->db->getRow(
			array(
				array( "#__morpheus", 'm' )
			),
			'm.*',
			$wheres
		);

		$res->success = !empty($component); 
		$res->component = $component;
		return $res;
	}

	
	/**
	 * Update/Insert
	 */
	public function upsert($id=0, $data=[]) {

		$res = $this->res();

		// Get Data
		if(empty($data)) $data = $this->getPost('data', []);
		if(!is_array($data)) $data = json_decode($data, true);
		
  }


  /**
	 * Remove
	 */
	public function remove($id=0) {
		$res = $this->res();

		$id = $this->getPost('id', 0);

		if(!empty($id)) {
			$this->db->deleteData( '#__morpheus', [ ['id', $id] ] );
		}
		
		$res->success = true; 
		
		return $res;
  }

}
		
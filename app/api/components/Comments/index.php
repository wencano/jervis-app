<?php if(!defined("ACCESS")) die("Direct access not allowed."); 

/**
 * Comments Controller
 *
 */
class CommentsController extends ComponentController {
	
	public $_name = "Comments";
	public $_table = "#__comments";
	
	
	/**
	 * Run
	 */
	public function run() {
		return parent::run();
		
	}
	
	
	/**
	 * Get Comment
	 * 
	 * Retrives comment.
	 */
	public function _getComment( $id = 0 ) {
		
		$comment = $this->db->getRow( 
			[ ['#__comments','c'], ['#__users', 'u', 'c.author_id=u.id' ] ],
			'c.*,u.name AS author_name, u.name_first AS author_first, u.name_last AS author_last', 
			[ ['c.id', $id] ]
		);
		
		$comment = empty($comment) ? [] : $comment;
		
		return $comment; 
	}
	
	
	/**
	 * Get Comments
	 * 
	 * Retrieves comments according to date of creation.
	 */
	public function _getComments( $wheres ) {
		
		// Get Comments
		$comments = $this->db->getData( 
			[ ['#__comments','c'], ['#__users', 'u', 'c.author_id=u.id' ] ],
			'c.*,u.name AS author_name, u.name_first AS author_first, u.name_last AS author_last', 
			$wheres,
			[ 'date_created', 'asc' ]
		);
		
		$comments = empty($comments) ? [] : $comments;
		
		return $comments; 
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
		
		// Default to User comments
		if(empty($filters)) $wheres[] = [ 'c.author_id', $this->user->id ];
		
		// Filter by Component
		if(!empty($component)) $wheres[] = [ 'c.component', $component ];
		if(!empty($item_id)) $wheres[] = ['c.item_id', $item_id];
		
		// Filter for User Component
		if(!empty($filters['user_id'])) $wheres[] = ['c.author_id', $filters['user_id']];
		
		$comments = $this->_getComments($wheres);
		
		$res->comments = $comments; 
		$res->success = true;
		
		return $res;
		
	}
	
	
	/**
	 * Upsert
	 */
	public function upsert($id = 0, $data = [] ){
		$res = $this->res();
		
		$comment = $this->getPost('comment');
		
		if(empty($comment)) return $res;
		
		$author_id = $this->user->id; 
		$component = $comment['component'];
		$item_id = $comment['item_id'];
		$message = $comment['message'];
		
		if(empty($message) || empty($author_id)) return $res;
		
		$upserted = Commenter::post( $author_id, $component, $item_id, $message );
		$res->comment = $this->_getComment($upserted['id']);
		if( !empty($res->comment) && is_numeric( $res->comment['id'] ) ) $res->success = true;
		
		return $res; 
		
	}
	
	
	/**
	 * Delete
	 * 
	 * Deletes comment according by ID.
	 */
	public function remove($id = 0) {
		$res = $this->res();
		if(!$this->is('admin') && !$this->is('dispatcher')) return $res; 
		
		$id = $this->getPost('id', 0);
		
		// Validate IDs
		if(empty($id)) return $res; 
		
		$this->db->deleteData('#__comments', [ ['id', $id] ] );
		
		$res->success = true;
		return $res; 
		
	}
	
	
	
	
	
}
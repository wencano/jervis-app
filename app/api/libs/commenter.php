<?php if(!defined("ACCESS")) die("Direct access not allowed."); 


/**
 * Commenter Helper Class
 */
class Commenter {
	
	
	/**
	 * Create New Notification
	 * 
	 */
	public static function _( $author_id = 0, $component = 'notification', $item_id = 0, $message = '' ) {
		global $db; 
		
		return [ 
			'id' => null,
			'author_id' => $author_id,
			'component' => $component,
			'item_id' => $item_id,
			'date_created' => date("Y-m-d H:i:s"),
			'message' => strip_tags( $message )
		];
	}
	
	
	/**
	 * Comment
	 */
	public static function post( $author_id = 0, $component = 'notification', $item_id = 0, $message = ''  ) {
		global $db;
		$comment = self::_($author_id, $component, $item_id, $message );
		$comment['id'] = $db->insertData( '#__comments', $comment );
		return $comment; 
	}
	
}
<?php if(!defined("ACCESS")) die("Direct access not allowed."); 


/**
 * Logger Helper Class
 */
class Logger {
	
	
	/**
	 * Create New Notification
	 * 
	 * Creates a new notification.
	 */
	public static function _( $author_id = 0, $component = 'notification', $item_id = 0, $task = '', $message = '' ) {
		global $db; 
		
		$author = $db->getRow('#__users', '', [ ['id', $author_id] ]);
		$message = str_replace( '[author_name]', $author['name'], $message );
		
		return [ 
			'id' => null,
			'author_id' => $author_id,
			'component' => $component,
			'item_id' => $item_id,
			'task' => $task,
			'date_created' => date("Y-m-d H:i:s"),
			'date_read' => '0000-00-00 00:00:00',
			'message' => strip_tags( $message )
		];
	}
	
	
	/**
	 * Log
	 */
	public static function toLog( $author_id = 0, $component = 'notification', $item_id = 0, $task = '', $message = ''  ) {
		global $db;
		$notif = self::_($author_id, $component, $item_id, $task, $message );
		$db->insertData( '#__logs', $notif );
	}
	
}
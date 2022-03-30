<?php

class Files {


	/**
	 * Construct
	 */
	function __construct() {
		global $app; 
		$this->db = $app->db; 
		$this->user = $app->user;
	}
	
	
	/**
	 * Insert Files
	 * 
	 * Inserts multiple files.
	 *
	 * default:
		$files = array(
			array( 
				'folder' => '',
				'tmp_name' => '',
				
				'id' => 0,
				'name' => '',
				'location' => '',					// Relative to Data Folder
				'user_id' => 0,
				'property_id' => 0,
				'unit_id' => 0,
				'lease_id' => 0,
				'type' => '',
				'size' => 0,
				'date_created' => date('Y-m-d'),
				'date_modified' => date('Y-m-d'),
				'notes' => ''
			)
		)
	 );
	 */
	public function insert( $files = array() ) {
		$res = (object)array( 'success' => false, 'files' => [], 'errors' => [], 'message' => '' );
		
		foreach( $files as $k=>$f ) {
			
			// Create Folder, recursive
			if(!file_exists($f['folder'])) mkdir( $f['folder'], 0777, true ); 
			
			// File Exists (ignore, overwrite)
			if( file_exists( $f['destination'] ) ) {
				$f['id'] = $this->db->getVar( '#__files', 'id', [ ['property_id', $f['property_id']], ['unit_id', $f['unit_id']], ['lease_id',$f['lease_id']], ['name',$f['name'] ] ] );
			}
			
			// Move File
			if(empty($res->errors)) {
				$fileMoved = move_uploaded_file($f["tmp_name"], $f['destination']);
				if( $fileMoved ) {
					
					// Unset folder, tmp_name
					unset( $f['folder'], $f['tmp_name'], $f['destination'] );
					
					// Date Created, Modified
					if(empty( $f['date_created'] )) $f['date_created'] = date('Y-m-d');
					if(empty( $f['date_created'] )) $f['date_modified'] = date('Y-m-d');
					
					// Insert Data
					if(empty($f['id']) || $f['id'] == 'new' ) {
						$f['id'] = $this->db->insertData( "#__files", $f );
					}
					
					// Update Data
					else {
						$this->db->updateData( "#__files", $f, [['id',$f['id']]] );
					}
					
					$res->files[] = $f;
					
				}
				
				// Error
				else {
					$res->errors[] = "Error moving file: " . $f['location'];
				}
			}
			
			if(empty($res->errors)) $res->success = true;
			
		}
		
		return $res; 
		
	}
	
	
	/**
	 * Insert Single
	 * 
	 * Inserts a single file.
	 */
	public function insertSingle( $file ) {
		$res = $this->insert( [$file] );
		if( $res->success && !empty($res->files) ) $res->file = $res->files[0];
		return $res;
	}
	
	
	
	/**
	 * Get Files
	 * 
	 * Retrives files.
	 */
	public function get( $property_id = 0, $unit_id = 0, $lease_id = 0, $filters = array(), $sort = array( 'date_modified', 'desc' ), $limit = '' ) {
		$res = (object)[ 'success' => false, 'errors' => [], 'files' => [], 'message' => 'File(s) not found.' ];
		
		$wheres = array();
		if(!empty($property_id))				$wheres[] = ['property_id', $property_id];
		$wheres[] = ['unit_id', ( $unit_id == -1 ? 0 : $unit_id )];
		$wheres[] = ['lease_id', ( $lease_id == -1 ? 0 : $lease_id )];
		if(!empty($filters['name'])) 		$wheres[] = ['name', '%'.$filters['name'].'%', 'like'];
		if(!empty($filters['user_id'])) $wheres[] = ['user_id', $filters['user_id']];
		if(!empty($filters['type'])) 		$wheres[] = ['type', explode(',', $filters['type'] ), 'in'];
		
		$res->files = $this->db->getData( '#__files', '', $wheres, $sort, $limit );
		if(!empty($res->files)) $res->success = true;
		
		return $res;
		
	}
	
	
	/**
	 * Get Single
	 */
	public function getSingle($property_id = 0, $unit_id = 0, $lease_id = 0, $filters = array(), $sort = array( 'date_modified', 'desc' ), $limit = '' ) {
		$res = $this->get($property_id = 0, $unit_id = 0, $lease_id = 0, $filters = array(), $sort = array( 'date_modified', 'desc' ), $limit = '' );
		if( $res->success && !empty($res->files) ) $res->file = $res->files[0];
		return $res; 
	}
	
	
	
	
	/**
	 * Delete Files
	 */
	public function del( $id = 0, $filters = array() ) {
		
		$res = (object)[ 'success' => false, 'files' => [], 'errors' => [], 'message' => 'Unable to delete file(s).' ];
		
		$wheres = [];
		if(!empty($id)) $wheres[] = [ 'id', $id ];
		if(!empty($filters['property_id'])) $wheres[] = ['property_id', $filters['property_id']];
		if(!empty($filters['user_id'])) $wheres[] = ['user_id', $filters['user_id']];
		if(!empty($filters['unit_id'])) $wheres[] = ['unit_id', $filters['unit_id']];
		if(!empty($filters['lease_id'])) $wheres[] = ['lease_id', $filters['lease_id']]; 
			
		$files = $this->db->getData("#__files", '', $wheres );
		
		if(!empty($files)) {
			
			foreach( $files as $f ) {
				
				// Remove From Disk
				$deleted = false;
				if( file_exists( FSROOT . $f['location'] ) ) $deleted = unlink( FSROOT . $f['location'] );
				else  $res->errors[] = "File not found in disk. [". $f['location'] . "]";
				
				if( !$deleted ) $res->errors[] = "Unable to delete file. [". $f['location'] . "]";
				
				// Remove From Database
				$deleteDb = $this->db->deleteData( '#__files', [ ['id', $f['id'] ] ] );
				if($deleteDb) $res->files[] = $f;
				else $res->errors[] = "Unable to delete file from DB. [". $f['id'] . "]";
				
			}
			
			// Inform deleted
			if( !empty( $res->files ) ) {
				$res->message = count($files) . " file(s) successfully deleted.";
			}
			
			// Inform not deleted
			if(!empty($res->errors)) {
				$res->message = "Please check the following errors: \n" . implode( "\n - ", $res->errors ); 
			}
			
			// Delete Status
			if( count($files) == count( $res->files ) ) {
				$res->success = true;
			}
			
		}
		
		// ERROR: No Files
		else {
			$res->message = "File(s) not found.";
		}
		
		return $res; 
		
		
	}

}
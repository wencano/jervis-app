<?php if(!defined("ACCESS")) die("Direct access not allowed."); 

/**
 * Settings Controller
 *
 */
class SettingsController extends ComponentController {
	
	public $_name = "Settings";
	public $_table = "#__settings";
	
	
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
		$res = (object)['success'=>true, 'settings'=>[]];
		
		// if( $this->isNot(['admin','dispatcher']) ) return $this->res; 
		
		$settings = $this->db->getData( $this->_table );
		
		// Convert to Object
		foreach($settings as $s) $res->settings[ $s['setting'] ] = $s['value'];
		
		return $res;
	}
	
	
	/**
	 * Update
	 * 
	 * Performs update on technician settings.
	 */
	public function update($id=0, $data=[]) {
		$res = $this->res;
		if( $this->isNot(['admin','dispatcher']) ) return $res; 
		
		$settings = $this->getPost('settings');
		
		$settingsDb = [];
		if(!empty($settings)) {
			foreach($settings as $k=>$v) {
				$updateAction = $this->db->updateData( $this->_table, ['value' => $v], [ ['setting', $k] ] );
			}
			$res->success = true; 
			
			// Log
			$message = "<b>[author_name]</b> updated the following Settings: " . ( implode(', ', array_keys($settings)) ) . ".";
			Notifier::toDispatchers($this->user->id, 'settings', 0, 'update', $message);
			
		}
		
		$res->settings = $this->getItems();
		
		
		
		return $res;
	}
	
	
	/**
	 * Get Single Setting - No access control
	 */
	public function setting() {
		
		$res = (object)['success' => true, 'setting' => [] ];
		
		$setting_key = empty( $this->postdata['setting_key'] ) ? '' : $this->postdata['setting_key'];
		
		if(!empty($setting_key)) $setting = $this->db->getRow( $this->_table, '*', [ ['setting', $session_key] ] ); 
		
		if(!empty($setting)) {
			$res->setting = [$setting_key => $setting['value']];
			$res->success = true;
		}
		
		return $res;
		
	}
	
	
}
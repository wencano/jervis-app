<?php if(!defined("ACCESS")) die("Direct access not allowed."); 


/**
 * Dashboard Controller
 *
 */
class DashboardController extends ComponentController {
	
	public $_name = "Dashboard";
	
		
	/**
	 * Dashboard Counters
	 */
	public function getItems( $wheres = [] ) {
		
		$res = $this->res();
		
		return $res; 
	}
	
}
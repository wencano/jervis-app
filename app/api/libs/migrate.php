<?php 
use function GuzzleHttp\json_encode;
if(!defined("ACCESS")) die("Direct access not allowed."); 


/**
 * Migrate Helper
 */
class MigrateHelper {


  /**
   * DB Migrate to 0.4.3
   */
  public function dbMigrate043_projects( $project_id = 0, $date = "", $date_end = "" ) {
    global $db; 
    $res = (object)[];

    if(empty($project_id)) $project_id = empty($_POST['project_id']) ? 0 : $_POST['project_id'];

    $res->time_begin = microtime(true);

    /** 
     * Set Default free_miles and mile_rate
     */ 
    $wheres = [[ 'date_created', '2019-03-01', '<']];
    if(!empty($project_id)) $wheres[] = [ 'id', $project_id ];
    $db->updateData('#__projects', [ 'free_miles' => 25, 'mile_rate' => 0.55 ], $wheres );
    $res->count_defaults_beforeMar1 = (int)$db->getVar('#__projects', 'COUNT(id)', $wheres);

    $wheres = [[ 'date_created', '2019-03-01', '>=']];
    if(!empty($project_id)) $wheres[] = [ 'id', $project_id ];
    $db->updateData('#__projects', [ 'free_miles' => 30, 'mile_rate' => 0.58 ], $wheres );
    $res->count_defaults_Mar1 = (int)$db->getVar('#__projects', 'COUNT(id)', $wheres);


		$completed = self::markCompleted($project_id, $date, $date_end );
		$res->completed_wheres = $completed->completed_wheres;
		$res->count_completed = $completed->count_completed; 
   

    /**
     * Reconcile Dispatch Info
     */
    $reconcile_dispatch = ProjectsHelper::reconcile( $project_id, $date, $date_end );
    $res->count_reconciled = $reconcile_dispatch->count_reconciled; 
    $res->reconcile_dispatch = $reconcile_dispatch;



    
    $res->time_end = microtime(true);
    $res->time_diff = $res->time_end - $res->time_begin; 

    return $res; 

  }
  
  /**
   * markCompleted
   * 
   * Marks a project as completed and by noting its project id, and the turnaround time.
   */
	
	public function markCompleted( $project_id = 0, $date = "", $date_end = "" ) {
		
		global $db; 
		
		$res = (object)[];
		
		 /**
     * Mark Completed
     */
    $wheres = [ ['p.tech_id', 0, '!='], [ 'p.status', 3 ] ];
    if(!empty($project_id)) $wheres[] = ['p.id', $project_id];               // Limit by Project ID
    if(!empty($date)) $wheres[] = ['p.date_dispatched', $date, '>='];           // Limit by Date Created
    if(!empty($date_end)) $wheres[] = ['p.date_dispatched', $date_end, '<'];    // Limit by Date Created
    if(empty($project_id) && empty($date)) $wheres[] = ['p.date_dispatched', '2019-03-01', '<'];

    $res->completed_wheres = $wheres; 

    $projects = $db->getData( 
      [ ['#__projects', 'p'], ['#__locations','l','p.location_id=l.id'], ['#__users', 'tech', 'p.tech_id=tech.id'], ['#__user_locations', 'techloc', 'p.tech_id=techloc.tech_id'] ], 
      'p.*,l.state, ' . 
        "CONCAT(l.city, ', ', l.state) AS location_name, " .
        'tech.name AS tech_name, ' .
        'tech.hourly_rate AS tech_hourly_rate, ' .
        'techloc.address_street AS tech_street, ' .
        'techloc.address_city AS tech_city, ' .
        'techloc.address_zip AS tech_zip, ' .
        'l.state as tech_state' .
      '',
      $wheres
    );
    $projects = empty($projects) ? [] : $projects; 

    $res->count_completed = count($projects);
    foreach($projects as $k=>$project) {

      $update = [
        'status' => 4,
        'date_completed' => date("Y-m-d H:i:s", strtotime( $project['date_dispatched'] . " + 7 days" ) ),   // Add 1 week
        'author_completed' => 10015   // Mike Ripa Admin
      ];

      $db->updateData( '#__projects', $update, [ ['id', $project['id']] ] );

      $message = "<b>[author_name]</b> has assigned COMPLETED status to the project <b>" . $project['title'] . "</b> (" . $project['location_name'] . ") dispatched to <b>" . $project['tech_name'] . "</b>.";
      Logger::toLog( 10015, 'projects', $project['id'], 'complete', $message );

    }
		
		return $res; 
		
	}
    

}
	
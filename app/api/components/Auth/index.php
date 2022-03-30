<?php if(!defined("ACCESS")) die("Direct access not allowed."); 


/**
 * Authentication Controller
 *
 * session, login, logout
 */
class AuthController extends ComponentController {
	
	
	/**
	 * Default
	 */
	public function run() {
		
		// Work Around for Reset
		if( !empty($this->_task) && $this->_task != 'list' ) {
			$task = $this->_task;
			return $this->$task(); 
		}
		
		
		// Default Function 
		$res = (object)['success' => false, 'message' => 'User not found.'];
		$task			= empty( $_POST['task'] ) ? '' : $_POST['task'];
		
		// Task: Login
		if( $task == 'login' ) $res = $this->login();
		
		// Task: Logout
		else if ($task == 'logout' ) $res = $this->logout();
		
		// Task: Check Session
		else $res = $this->checkSession();
		
		return $res;
		
	}
	
	
	/**
	 * Task: Check Session
	 */
	public function checkSession() {
		$res = $this->res();
		
		if( !empty( $this->user->id ) ) {
			$res->user				= $this->user;
			$res->success = true;
			$res->message =	"API Data Retrieved.";
		}
		
		return $res; 
		
	}
	
	
	/**
	 * Task: Login
	 */
	public function login() {
		
		$res 			= new stdClass();
		
		$u				= (object)array(
			"email" => empty( $_POST['email'] ) ? "" : $_POST['email'],
			"pass" 	=> empty( $_POST['pass'] ) ? "" : md5( $_POST['pass'] )
		);
		
		// Find User
		$where = array( 
			array( 'email', $u->email ),
			array( 'pass', $u->pass ), 
			array( 'status', 1 )
		);
		$user = (object)$this->db->getRow( '#__users', '*', $where );
		
		// Create Session and add to User
		if(!empty($user->id) ) {
			
			$session = (object)array(
				"session_key" 	=> Helpers::uniqidReal(25),
				"user_id"			=> $user->id, 
				"timein"			=> date("c"),
				"last"				=> date("c"),
				"timeout"			=> ""
			);
			
			$this->db->insertData( "#__sessions", (array)$session );
			
			// Response User
			unset( $user->pass );
			$user->locations = explode(",", $user->locations);
			
			$res->user 		= $user;
			$res->session = $session;
			$res->session_key = $session->session_key;
			$res->success	= true;
			$res->message	= "Login successful.";
		}
		
		else {
			$res->success = false;
			$res->message = "Login failed.";
		}
		
		return $res;
		
	}
	
	
	/**
	 * Logout
	 * 
	 * Terminates session.
	 */
	public function logout() {
		return ['success' => $this->db->updateData( "#__sessions", ["timeout" => date("c" )], [ ["session_key", $this->session->session_key] ] ) ];
	}
	
	
	/**
	 * Reset Password
	 * 
	 * Resets password.
	 */
	public function reset_password() {
		global $config, $settings; 
		
		$res = $this->res();
		$email = $this->getPost('email');
		
		// Find User by Email
		$user = $this->db->getRow('#__users', '', [ ['email', $email] ] );
		
		// Verify User
		if( empty($user) ) return array_merge( $res, ['message'=>'User not found.'] ); 
		
		// Process Request
		else {
			
			// Create Key
			$reset_key = Helpers::uniqidReal(25);
			$reset_link = $config->admin . 'verify-reset-password/' . $reset_key . '/';
			
			// Update in DB
			$update = [ 'reset_key' => $reset_key, 'reset_timestamp' => date("Y-m-d H:i:s") ];
			$this->db->updateData('#__users', $update, [ ['id', $user['id']] ] );
			
			// Compose Message
			$message = $settings['reset_password_notif'];
			$message = str_replace( ['[User_Name]', '[Reset_Link]'], [ $user['name'], $reset_link ], $message );
			
			// Send Email
			$res->email_notif = Notifier::sendEmail( $user, [ 'subject' => 'Password Reset Link', 'message' => $message ] );
			$res->success = true; 
		}
		
		return $res; 
		
	}
	
	
	/**
	 * Verify Reset Password
	 * 
	 * Verification for password reset.
	 */
	public function verify_reset_password() {
		
		$res = $this->res();
		$reset_key = $this->getPost('reset_key');
		
		if(empty($reset_key) ) return array_merge( (array)$res, [ 'message' => 'Invalid reset request.' ] ); 
		
		// Find User
		$user = $this->db->getRow( '#__users', '', [[ 'reset_key', $reset_key ]] );
		
		// Validate User
		if( empty($user)) return array_merge( (array)$res, [ 'message' => 'User not found.' ] );
		
		// Validate Time
		$reset_time = strtotime( $user['reset_timestamp'] );
		$now_time = strtotime("now");
		$dayToSeconds = 24 * 60 * 60;
		$compare_time = $now_time - $reset_time; 
		
		if( $compare_time > $dayToSeconds ) {
			$update = [ 'reset_key' => '', 'reset_timestamp' => '0000-00-00 00:00:00' ];
			$this->db->updateData( '#__users', $update, [ ['id', $user['id'] ] ] );
			return array_merge( (array)$res, [ 'message' => 'Reset time expired in 24 hours. Please try again.'] );
		}
		
		return array_merge( (array)$res, [ 'success' => true ] );
		
	}
	
	
	/**
	 * Set Password
	 */
	public function setpass() {
		
		$res = $this->res();
		$reset_key = $this->getPost('reset_key');
		$pass = $this->getPost('pass');
		
		if(empty($reset_key) || empty($pass) ) return array_merge( (array)$res, [ 'message' => 'Invalid reset request.' ] ); 
		
		// Find User
		$user = $this->db->getRow( '#__users', '', [[ 'reset_key', $reset_key ]] );
		
		// Validate User
		if( empty($user)) return array_merge( (array)$res, [ 'message' => 'User not found.' ] );
		
		// Reset Password
		$update = [ 
			'pass' => md5( $pass ),
			'reset_key' => '', 
			'reset_timestamp' => '0000-00-00 00:00:00' 
		];
		
		$this->db->updateData( '#__users', $update, [ ['id', $user['id'] ]  ] );
		$res->success = true;
		$res->message = "Password successfully updated. Please login now.";
		
		return $res; 
	}
	
	
	/**
	 * Signup Params
	 */
	public function signupParams() {
		$res = $this->res();
		
		$res->params = [
			"categories" => $this->db->getData( '#__categories', '', [ ['access', 0] ], [ 'name', 'asc'] ),
			"locations" => $this->db->getData( '#__locations', "*, CONCAT(city, ', ', state) AS name ", [ ['status', 1] ], [ 'city', 'asc' ] )
		];
		
		$res->success = true; 
		return $res; 
		
	}
	
	
}
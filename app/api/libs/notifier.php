<?php 

//Load Composer's autoloader
require_once( FSVENDOR . 'autoload.php' );

// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Twilio\Rest\Client;
use Twilio\Exceptions\RestException;




/**
 * Notifier Helper Class
 */
class Notifier {
	
	public static $twilioClient = null; 
	
	
	/**
	 * Create New Notification
	 */
	public static function _( $author_id = 0, $recipient_id = 0, $component = 'notification', $item_id = 0, $task = '', $message = '' ) {
		global $db, $config; 
		
		if( $config->mode == 'test' ) $message = "[TESTMODE] " . $message; 
		
		$author = $db->getRow('#__users', '', [ ['id', $author_id] ]);
		if( $author_id == $recipient_id ) $message = str_replace( '[author_name]', 'You', $message );
		else if (!empty($author) ) $message = str_replace( '[author_name]', $author['name'], $message );
		
		
		return [ 
			'id' => null,
			'author_id' => $author_id,
			'recipient_id' => $recipient_id,
			'component' => $component,
			'item_id' => $item_id,
			'task' => $task,
			'date_created' => date("Y-m-d H:i:s"),
			'date_read' => '0000-00-00 00:00:00',
			'message' => $message
		];
	}
	
	
	/**
	 * Log
	 */
	public static function toLog( $author_id = 0, $component = 'notification', $item_id = 0, $task = '', $message = ''  ) {
		global $db;
		$notif = self::_($author_id, $author_id, $component, $item_id, $task, $message );
		$db->insertData( '#__notifications', $notif );
		
	}
	
	
	/**
	 * Notify Admins
	 */
	public static function toAdmins($author_id =0, $component = '', $item_id = 0, $task = '', $message = '', $channels = "none", $subject = ''  ) {
		global $db, $settings; 
		
		$admins = $db->getData('#__users', '', [ ['type', 'admin'], ['status', 1] ]);
		
		foreach( $admins as $dk => $user ) {
			
			// Skip Author
			// if($user['id'] == $author_id) continue;
			
			// Save Notification
			$notif_subject = empty($subject) ? $message : $subject; 
			$notif = self::_($author_id, $user['id'], $component, $item_id, $task, $notif_subject );
			$notif['id'] = $db->insertData( '#__notifications', $notif );
			
			$notif_subject = $notif['message'];
			$notif_message = self::_($author_id, $user['id'], $component, $item_id, $task, $message );
			$notif['message'] = $notif_message['message'];
			
			$update = [];
			
			// Send Email
			$user['email_success'] = false;
			if( ( $channels == 'all' || $channels == 'email' || (is_array($channels) && in_array('email', $channels))) && filter_var($user['email'], FILTER_VALIDATE_EMAIL) ) {
				$notif['subject'] = $notif_subject;
				$res_email = self::sendEmail( $user, $notif );
				$update['to_email'] = $res_email->success ? 'Email sent successfully.' : $res_email->message;
				$user['email_success'] = $res_email->success; 
			}
			
			// Send Twilio
			$user['sms_success'] = false;
			if( $settings['twilio_enabled'] == 1 && !empty( $user['phone'] ) && ( $channels == 'all' || $channels == 'twilio' || (is_array($channels) && in_array('twilio', $channels)) ) ) {
				$notif['message'] = $notif_subject;
				$res_sms = self::sendTwilio( $user, $notif );
				$update['to_twilio'] = $res_sms->message;
				$user['sms_success'] = $res_sms->success; 
			}
			
			if(!empty($update)) $db->updateData('#__notifications', $update, [['id', $notif['id']]] );
			
			$admins[$dk] = $user;
			
		}
		
		return $admins; 
		
	}
	
	
	
	/**
	 * Notify Dispatchers
	 */
	public static function toDispatchers($author_id =0, $component = '', $item_id = 0, $task = '', $message = '', $channels = "none", $subject = ''  ) {
		global $db, $settings; 
		
		$dispatchers = $db->getData('#__users', '', [ ['type', 'dispatcher'], ['status', 1] ]);
		
		foreach( $dispatchers as $dk => $user ) {
			
			// Skip Author
			if($user['id'] == $author_id) continue;
			
			// Save Notification
			$notif_subject = empty($subject) ? $message : $subject; 
			$notif = self::_($author_id, $user['id'], $component, $item_id, $task, $notif_subject );
			$notif['id'] = $db->insertData( '#__notifications', $notif );
			
			$notif_subject = $notif['message'];
			$notif_message = self::_($author_id, $user['id'], $component, $item_id, $task, $message );
			$notif['message'] = $notif_message['message'];
			
			$update = [];
			
			// Send Email
			$user['email_success'] = false;
			if( ( $channels == 'all' || $channels == 'email' || (is_array($channels) && in_array('email', $channels))) && filter_var($user['email'], FILTER_VALIDATE_EMAIL) ) {
				
				$notif['subject'] = $notif_subject;
				
				$res_email = self::sendEmail( $user, $notif );
				$update['to_email'] = $res_email->success ? 'Email sent successfully.' : $res_email->message;
				$user['email_success'] = $res_email->success; 
			}
			
			// Send Twilio
			$user['sms_success'] = false;
			if( $settings['twilio_enabled'] == 1 && !empty( $user['phone'] ) && ( $channels == 'all' || $channels == 'twilio' || (is_array($channels) && in_array('twilio', $channels)) ) ) {
				$notif['message'] = $notif_subject;
				$res_sms = self::sendTwilio( $user, $notif );
				$update['to_twilio'] = $res_sms->message;
				$user['sms_success'] = $res_sms->success; 
			}
			
			if(!empty($update)) $db->updateData('#__notifications', $update, [['id', $notif['id']]] );
			
			$dispatchers[$dk] = $user;
			
		}
		
		return $dispatchers; 
		
	}
	
	
	/**
	 * Notify Technicians
	 */
	public static function toTechnicians( $author_id =0, $component = '', $item_id = 0, $task = '', $message = '', $tech_ids = [], $location_id = '', $category_ids = [], $channels = "none" ) {
		global $db, $settings;
		
		$wheres = [ ['u.type', 'technician'], ['u.status', 1] ];
		
		// Limit by Selected Technicians
		if( !empty($tech_ids) ) {
			$wheres[] = [ 'u.id', $tech_ids, 'in' ];
		}
		
		else {
			
			// Limit by Location
			if(!empty($location_id)) $wheres[] = ['ul.location_id', $location_id];
			
			// Limit by Category
			if( !empty($category_ids) ) {
				include_once(FSCOM . 'Users/index.php' );
				$tech_ids = UsersController::getInstance()->getTechIdsFromAllCategoryIds( $category_ids, $location_id );
				if(empty($tech_ids)) return [];
				$wheres[] = [ 'u.id', $tech_ids, 'in' ];
			}
			
		}
		
		// Get IDs first
		$tech_ids_only = $db->getDistinct( 
			[ 
				['#__users', 'u'],
				['#__user_locations', 'ul', 'ul.tech_id = u.id']
			],
			'u.id',
			$wheres
		);
		$tech_ids_only = Helpers::flatten($tech_ids_only, 'id');
		$technicians = $db->getData(
			[ 
				['#__users', 'u']
			],
			'u.*',
			[['u.id', $tech_ids_only, 'in']]
		);
		
		if(empty($technicians)) return [];
		
		foreach( $technicians as $i=>$user ) {
			
			// Skip Author
			if($user['id'] == $author_id) continue;
			
			// Save Notification
			$notif = self::_($author_id, $user['id'], $component, $item_id, $task, $message);
			$notif['id'] = $db->insertData( '#__notifications', $notif );
			
			$update = [];
			
			// Send Email
			$user['email_success'] = false;
			if( ( $channels == 'all' || $channels == 'email' || (is_array($channels) && in_array('email', $channels))) && 
				filter_var($user['email'], FILTER_VALIDATE_EMAIL) ) {
				
				$res_email = self::sendEmail( $user, $notif );
				$update['to_email'] = $res_email->success ? 'Email sent successfully.' : $res_email->message;
				$user['email_success'] = $res_email->success; 
			}
			
			// Send Twilio
			$user['sms_success'] = false;
			if( $settings['twilio_enabled'] == 1 && !empty( $user['phone'] ) && ( $channels == 'all' || $channels == 'twilio' || (is_array($channels) && in_array('twilio', $channels)) ) ) {
				$res_sms = self::sendTwilio( $user, $notif );
				$update['to_twilio'] = $res_sms->message;
				$user['sms_success'] = $res_sms->success; 
			}
			
			if(!empty($update)) $db->updateData('#__notifications', $update, [['id', $notif['id']]] );
			
			$technicians[$i] = $user; 
			
		}
		
		return $technicians; 
		
	}
	
	
	/**
	 * Notify Location Technicians
	 */
	public static function toLocationTechnicians( $author_id =0, $component = '', $item_id = 0, $task = '', $message = '', $tech_ids = [], $location_id = '', $category_ids = [], $channels = "all" ) {
		return self::toTechnicians( $author_id, $component, $item_id, $task, $message, $tech_ids, $location_id, $category_ids, $channels );
	}
	
	
	/**
	 * Notify Technicians
	 */
	public static function toTechnician( $author_id =0, $component = '', $item_id = 0, $task = '', $message = '', $tech_id = 0, $channels = 'all' ) {
		global $db, $settings;
		
		
		$user = $db->getRow( 
			[ 
				['#__users', 'u'],
				['#__user_locations', 'ul', 'ul.tech_id = u.id']
			],
			'u.*',
			[ ['u.id', $tech_id ] ]
		);
		
		if(!empty($user) ) {
			
			// Save Notification
			$notif = self::_($author_id, $user['id'], $component, $item_id, $task, $message);
			$notif['id'] = $db->insertData( '#__notifications', $notif );
			
			$update = [];
			
			// Send Email
			$user['email_success'] = false;
			if( ( $channels == 'all' || $channels == 'email' || (is_array($channels) && in_array('email', $channels))) && 
				filter_var($user['email'], FILTER_VALIDATE_EMAIL) ) {
				
				
				$res_email = self::sendEmail( $user, $notif );
				$update['to_email'] = $res_email->success ? 'Email sent successfully.' : $res_email->message;
				$user['email_success'] = $res_email->success; 
			}
			
			// Send Twilio
			$user['sms_success'] = false;
			if( $settings['twilio_enabled'] == 1 && !empty( $user['phone'] ) && ( $channels == 'all' || $channels == 'twilio' || (is_array($channels) && in_array('twilio', $channels)) ) ) {
				$res_sms = self::sendTwilio( $user, $notif );
				$update['to_twilio'] = $res_sms->message;
				$user['sms_success'] = $res_sms->success; 
			}
			
			if(!empty($update)) $db->updateData('#__notifications', $update, [['id', $notif['id']]] );
			
		}
		
		return $user; 
		
	}
	
	
	/**
	 * Notify User/Users
	 */
	public static function toUsers( $author_id =0, $user_ids = [], $component = '', $item_id = 0, $task = '', $message = '', $channels = "none", $subject = ''  ) {
		global $db, $settings; 
		
		$users = $db->getData('#__users', '', [ [ 'id', $user_ids, 'in' ] ] );
		
		foreach( $users as $dk => $user ) {
			
			// Skip Author
			if($user['id'] == $author_id) continue;
			
			// Save Notification
			$notif_subject = empty($subject) ? $message : $subject; 
			$notif = self::_($author_id, $user['id'], $component, $item_id, $task, $notif_subject );
			$notif['id'] = $db->insertData( '#__notifications', $notif );
			
			$notif_subject = $notif['message'];
			$notif_message = self::_($author_id, $user['id'], $component, $item_id, $task, $message );
			$notif['message'] = $notif_message['message'];
			
			$update = [];
			
			// Send Email
			$user['email_success'] = false;
			if( ( $channels == 'all' || $channels == 'email' || (is_array($channels) && in_array('email', $channels))) && filter_var($user['email'], FILTER_VALIDATE_EMAIL) ) {
				$notif['subject'] = $notif_subject; 
				$res_email = self::sendEmail( $user, $notif );
				$update['to_email'] = $res_email->success ? 'Email sent successfully.' : $res_email->message;
				$user['email_success'] = $res_email->success; 
			}
			
			// Send Twilio
			$user['sms_success'] = false;
			if( $settings['twilio_enabled'] == 1 && !empty( $user['phone'] ) && ( $channels == 'all' || $channels == 'twilio' || (is_array($channels) && in_array('twilio', $channels)) ) ) {
				$notif['message'] = $notif_subject;
				$res_sms = self::sendTwilio( $user, $notif );
				$update['to_twilio'] = $res_sms->message;
				$user['sms_success'] = $res_sms->success; 
			}
			
			if(!empty($update)) $db->updateData('#__notifications', $update, [['id', $notif['id']]] );
			
			$users[$dk] = $user;
			
		}
		
		return $users; 
		
	}
	
	
	
	/**
	 * Send Email
	 */
	public static function sendEmail( $recipient = [], $notif ) {
		global $settings, $mail, $config; 
		
		$res = (object)[ 'success' => false, 'message' => '' ];
		$mail = new PHPMailer(true); 

		try {
			
			// Setup SMTP
			if( $settings['smtp_enabled'] == 1 ) {
				
				//Server settings
				//$mail->SMTPDebug = 2;                                 // Enable verbose debug output
				$mail->Host = $settings['smtp_host'];  								// Specify main and backup SMTP servers
				$mail->SMTPAuth = true;                               // Enable SMTP authentication
				$mail->Username = $settings['smtp_user'];             // SMTP username
				$mail->Password = $settings['smtp_pass'];             // SMTP password
				$mail->SMTPSecure = $settings['smtp_security'];                            // Enable TLS encryption, `ssl` also accepted
				$mail->Port = $settings['smtp_port'];             // TCP port to connect to
				$mail->isSMTP();																	// Set mailer to use SMTP
			}
			
			//Recipients
			$mail->setFrom('info@powersiot.com', 'Powers IoT');
			$mail->addReplyTo('info@powersiot.com', 'Powers IoT');
			
			$mail->addAddress( $recipient['email'], $recipient['name'] );     								// Add a recipient
			//$mail->addAddress('ellen@example.com');               // Name is optional
			//$mail->addReplyTo('info@example.com', 'Information');
			//$mail->addCC('cc@example.com');
			//$mail->addBCC('bcc@example.com');

			//Attachments
			//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
			//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

			//Content
			$mail->isHTML(true);                                  // Set email format to HTML
			$mail->Subject = empty($notif['subject']) ? strip_tags( $notif['message'] ) : strip_tags( $notif['subject'] );
			$notif['message'] .=  "<br /><br />\n\n";
			
			// Add Link
			if( !empty($notif['component']) ) {
				$link = $config->admin . $notif['component'] . "/";
				$link .= !empty( $notif['item_id'] ) ? $notif['item_id'] . "/" : "";
				$notif['message'] 	.= "<a href=\"" . $link . "\" target=\"_blank\">" . $link . "</a>";
			}
			
			$mail->Body = $notif['message'];
			
			
			ob_start();
			
			$mail->send();
			$html = addslashes(ob_get_contents());
			ob_end_clean();
			
			$message = stripslashes( $html );
			
			$res->success = true; 
			$res->message = $message;
			
		} catch (Exception $e) {
			
			$message = "[" . date('c') . "] ERROR: " . $mail->ErrorInfo . ". Unable to send to " . $recipient['name'] . " <" . $recipient['email'] . "> \"" . strip_tags( $notif['message'] ) . ".\" ";
			
			$mailerlog = fopen( FSROOT . "/logs/mailer.txt", "a") or die("Unable to open file!");
			fwrite($mailerlog, "\n " . $message );
			fclose($mailerlog);
			
			$logMessage = "<b>Recipient:</b> " . $recipient['name'] . " &lt;" . $recipient['email'] . "&gt;\n";
			$logMessage .= "<b>Subject:</b> " . ( empty($notif['subject']) ? strip_tags( $notif['message'] ) : strip_tags( $notif['subject'] ) ) . "\n\n";
			$logMessage .= "<hr />\n\n";
			$logMessage = nl2br( $logMessage ) . $notif['message'];
			
			file_put_contents( 
				FSLOGS . "/email-" . (empty($recipient['type']) ? 'user' : $recipient['type'] ) . "-" . $recipient['email'] . "-" . date("Y-m-d") . ".html", 
				$logMessage
			);
			
			$res->message = $message;
		}
		
		return $res; 
		
	}
	
	
	/**
	 * Send Twilio
	 */
	public static function sendTwilio( $recipient = [], $notif, $creds = [] ) {
		global $settings, $config; 
		
		$res = (object)['success' => false, 'message' => '' ];
		
		
		// Validate Settings
		if($settings['twilio_enabled'] == 1 && !empty( $recipient['phone'] ) ) {
			
			$sid    = $settings['twilio_api_sid'];
			$token  = $settings['twilio_api_authtoken'];
			$from 	= $settings['twilio_api_from'];
			
			if(!empty($creds)) {
				$sid = empty($creds['sid']) ? $sid : $creds['sid'];
				$token = empty($creds['token']) ? $token : $creds['token'];
				$from = empty($creds['from']) ? $from : $creds['from'];
			}
			
			try {
				$twilio =  new Client($sid, $token);
				
				$message = "PowersIoT - Tech Scheduling: <br />\n" . $notif['message']  . "<br /><br />\n\n";
				
				// Add Link
				if( !empty($notif['component']) ) {
					$link = $config->admin . $notif['component'] . "/";
					$link .= !empty( $notif['item_id'] ) ? $notif['item_id'] . "/" : "";
					$message	.= $link;
				}
			
				$sendSMS = $twilio->messages
										->create( $recipient['phone'], // to
											 array(
												"from" => $from, 
												"body" => strip_tags( $message )
											)
										); 
				
				$res->message = $sendSMS->sid;
				$res->success = true; 
				
			}
			
			catch (RestException $e) {
				$message = "[" . date('c') . "] ERROR: " . $e->getMessage() . ". Unable to send to " . ( !empty( $recipient['name'] ) ? $recipient['name'] : '' ) . " phone number " . $recipient['phone'] . " \"" . strip_tags( $notif['message'] ) . ".\" ";
			
				$twiliolog = fopen( FSROOT . "/logs/twilio.txt", "a") or die("Unable to open file!");
				fwrite($twiliolog, "\n " . $message );
				fclose($twiliolog);
				
				$res->message = $message;
			}
			
		}
		
		return $res; 
		
		
	}
	
	public static function _getTwilioClient($sid = '', $token = '' ) {
		
		if (!self::$twilioClient) {
			self::$twilioClient = new Client($sid, $token);
		}
		return self::$twilioClient;
	}
	
}
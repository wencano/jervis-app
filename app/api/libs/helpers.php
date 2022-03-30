<?php if(!defined("ACCESS")) die("Direct access not allowed."); 

class Helpers {

	public static function config() {
		global $config;
		return $config; 
	}

	public static function getPost($key, $default) {
		if(!empty($key)) {
			if(isset($_POST[$key])) return $_POST[$key];
			else return $default;
		}
		else return $_POST; 
	}
	
	public static function slugify($text) {
		$text = strtolower($text);
		$patterns = array(
			'/\s+/',
			'/[^\w\-]+/',
			'/\-\-+/',
			'/^-+/',
			'/-+$/'
		);
		$replace = array( '-', '', '-', '', '' );
		
		return preg_replace( $patterns, $replace, $text );
	}
	
	public static function ext($file) {
	 $extension = end(explode(".", $file));
	 return $extension ? $extension : false;
	}
	
	public static function uniqidReal($lenght = 13) {
    // uniqid gives 13 chars, but you could adjust it to your needs.
    if (function_exists("random_bytes")) {
        $bytes = random_bytes(ceil($lenght / 2));
    } elseif (function_exists("openssl_random_pseudo_bytes")) {
        $bytes = openssl_random_pseudo_bytes(ceil($lenght / 2));
    } else {
        throw new Exception("no cryptographically secure random function available");
    }
    return substr(bin2hex($bytes), 0, $lenght);
	}
	
	// Get The Initials of Text Phrase
	public static function strInitials($text=""){
		$tx = explode(" ", ucwords(trim($text)));
		$txt = array();
		foreach($tx as $t) 
			if( !empty($t) )
				$txt[] = $t[0];
		return implode("",$txt);
	}
	
	/**
	 * Natural Sort 
	 */
	public static function sortmulti( $array, $index, $order = 'asc', $natsort=FALSE, $case_sensitive=FALSE ) {
		
		$sorted = [];
		if(is_array($array) && count($array)>0) {
			foreach(array_keys($array) as $key) $temp[$key]=$array[$key][$index];
			
			if(!$natsort) {
				if ($order=='asc') asort($temp);
				else arsort($temp);
			}
			else {
				if ($case_sensitive===true) natsort($temp);
				else natcasesort($temp);
				if($order!='asc') $temp=array_reverse($temp,TRUE);
			}
			foreach(array_keys($temp) as $key)
				if (is_numeric($key)) $sorted[]=$array[$key];
				else $sorted[$key]=$array[$key];
			return $sorted;
		}
		
		else $sorted = $array;
		
		return $sorted;
	}
	
	
	/**
	 * Natural Sort 2D
	 */
	public static function naturalsort( $array, $index, $order = 'asc' ) {
		return self::sortmulti($array, $index, $order, true );
	}
	
	
	
	
	
	/**
	 * Lodash Find (for Assoc Arrays only)
	 */
	public static function findIndex( $arr, $find, $matchAll = false ) {
		$index = !$matchAll ? -1 : []; 
		if(empty($arr)) return $index; 
		
		foreach($arr as $i=>$item) {
			foreach( $find as $key=>$value) {
				if( !empty($item[$key]) && $item[$key] == $value ) {
					if( !$matchAll ) $index = $i;
					else $index[] = $i; 
					break;
				}
			}
			
			if(!$matchAll && $index > -1) break;
			
		}
		
		return $index; 
		
	}
	
	// Find and Return Array
	public static function find( $arr, $find, $matchAll = false ) {
		$found = [];
		$index = self::findIndex( $arr, $find, $matchAll );
		
		if(!$matchAll && $index > -1) $found = $arr[$index];
		
		else if( $matchAll && !empty($index) )
			foreach($index as $i) 
				$found[] = $arr[$i];
			
		return $found; 
	}
	
	// Flatten to one array based on a key/field/column
	public static function flatten($arr, $key) {
		$flat = [];
		if(empty($arr)) return $flat;
		
		foreach($arr as $item) 
			if(!empty($item[$key]))
				$flat[] = $item[$key];
			
		return $flat;
	}
	
	
	/** 
	 * in_array for multiple values, all present
	 *
	 * echo in_array_all( [3,2,5], [5,8,3,1,2] ); // true, all 3, 2, 5 present
	 * echo in_array_all( [3,2,5,9], [5,8,3,1,2] ); // false, since 9 is not present
	 */
	public static function in_array_all($needles, $haystack) {
   return empty(array_diff($needles, $haystack));
	}
	
	
	/** 
	 * in_array for multiple values, atleast 1 is present
	 *
	 * echo in_array_any( [3,9], [5,8,3,1,2] ); // true, since 3 is present
	 * echo in_array_any( [4,9], [5,8,3,1,2] ); // false, neither 4 nor 9 is present
	 */
	public static function in_array_any($needles, $haystack) {
   return !empty(array_intersect($needles, $haystack));
	}
	
	
	/**
	 * Format Sched 
	 *
	 * - client sched, tech sched, final sched
	 */
	public static function formatSched( $sched ) {
		$time = [];
		
		if( !empty( $sched ) ) {
			
			if( $sched['t9_12pm'] == 1 ) $time[] = '9-12pm';
			if( $sched['t12_3pm'] == 1 ) $time[] = '12-3pm';
			if( $sched['t3_6pm'] == 1 ) $time[] = '3-6pm';
			if( $sched['t6_9pm'] == 1 ) $time[] = '6-9pm';
			
			return count( $time ) > 0 ? date( "M j", strtotime($sched['date']) ) . " " . implode( ", ", $time ) : false;
			
		}
		
		return false; 
		
	}
	
	
	/**
	 * cURL
	 */
	public static function curl($url, $post = []) {
		// Get cURL resource
		$curl = curl_init();
		// Set some options - we are passing in a useragent too here
		curl_setopt_array($curl, array(
				CURLOPT_RETURNTRANSFER => 1,
				CURLOPT_URL => $url,
				//CURLOPT_USERAGENT => 'PowersIoT Tech Scheduling',
				//CURLOPT_POST => 0,
				//CURLOPT_POSTFIELDS => $post
		));
		// Send the request & save response to $resp
		$resp = curl_exec($curl);
		// Close request to clear up some resources
		curl_close($curl);
		
		return $resp;
	}
	
	
	/**
	 * Form Address
	 */
	public static function formatAddress($street = '', $city = '', $zip = '', $state = '') {
		
		// Get Tech Distance
		$address = [];
		
		if( !empty($street) ) $address[] = $street;
		if( !empty($city) ) $address[] = $city;
		if( !empty($state ) ) $address[] = $state . (!empty($zip) ? " " . $zip : '' );
		
		return implode(", ", $address);
	}

	/**
	 * Format Address Require Street
	 */
	public static function formatAddressWithStreet($street = '', $city = '', $zip = '', $state = '') {
		
		// Get Tech Distance
		$address = '';
		if(empty($street)) return $address; 

		return self::formatAddress($street, $city, $zip, $state); 
	}



	/**
	 * Get the State Short Name from Long Name
	 */
	public static function getStateInfo($state='') {
		$states = json_decode( file_get_contents( FSLIBS . "us-states/simplelist.json" ), true );
		if(!empty($state)) {
			$state = strtolower($state);
			foreach($states as $s) {
				if( strtolower( $s['name']) == $state || strtolower($s['abbreviation']) == $state ) {
					return $s;
				}
			}
		}
		return false; 
	}


}
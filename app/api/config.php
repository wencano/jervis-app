<?php 

/** Database Access */
define('DB_NAME', 'jervis'); 
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_HOST', '127.0.0.1');
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');
define('DB_PREFIX', 'jv_');

/** Files */
define("DS", DIRECTORY_SEPARATOR); 
define("FSROOT", dirname(__FILE__) );
define("FSLIBS", FSROOT.DS."libs/");
define("FSLOGS", FSROOT.DS."logs/");
define("FSCON", FSROOT.DS."controllers/");
define("FSCOM", FSROOT.DS."components/");
define("FSDATA", FSROOT.DS."data/");
define("FSVENDOR", FSROOT.DS."vendor/");

/** Links */
$config = new stdClass();
$config->root 	=	'/jervis/app/';
$config->admin 	=	'http://localhost/jervis/app/';
$config->api		=	'/jervis/app/api/';
$config->assets		=	'/jervis/app/assets/';
$config->uploads		=	'/jervis/app/uploads/';
$config->version = '1.0.0'; 
$config->mode = "test";
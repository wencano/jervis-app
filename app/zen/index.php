<?php

/**
 * Zen API Entry Point
 *
 * This file loads all the libraries and vendor (external) libraries. The components are registered via the routes (GET and POST). 
 */
session_start();
date_default_timezone_set("UTC"); // Set server timezone to UTC for consistent time reference 

DEFINE('ACCESS', 'site');


// Dependencies
require( dirname(__FILE__) . '/config.php' );
require( FSROOT . '/bootstrap.php' );

$timestart = microtime(true);
$db 	= new core\Database();
$app 	= new core\App();

/**
 * Register Routes and Components
 */ 
// HTTP GET
$app->get('/', function(){
	require( FSVENDOR."autoload.php" );
	return  [ 'error' => "Restricted area." ];
});

$app->get('/tables/', function(){
	$orm = new core\ORM();
	return $orm->checkTables();
});


// Run
$app->run();
<?php

/**
 * API Entry Point
 *
 * This file loads all the libraries and vendor (external) libraries. The components are registered via the routes (GET and POST). 
 */
session_start();
date_default_timezone_set("UTC"); // Set server timezone to UTC for consistent time reference 

DEFINE('ACCESS', 'site');



// Dependecies
require(dirname(__FILE__) . '/config.php');
require( FSLIBS . 'db.php' );
require( FSLIBS . 'BaseController.php' );
require( FSLIBS . 'component.php' );
require( FSLIBS . 'helpers.php' );
require( FSLIBS . 'logger.php' );
require( FSLIBS . 'notifier.php' );
require( FSLIBS . 'commenter.php' );
require( 'app.php' );

// AJAX CORS
// header( 'Access-Control-Allow-Origin: ' . ( isset( $_SERVER['HTTP_ORIGIN'] ) ? $_SERVER['HTTP_ORIGIN'] : '' ) );

// Global $db and $app
$timestart = microtime(true);
$db 	= new Database();
$app 	= new App();
$settings = $app->settings;


/**
 * Register Routes and Components
 */ 
// HTTP GET
$app->get('/', function(){
	return  [ 'error' => "Restricted area." ];
});

$app->get('/routes/', 'Routes');

// Component: Auth
$app->post('/', 'Auth');
$app->post('/auth/reset_password/', 'Auth');
$app->post('/auth/verify_reset_password/', 'Auth');
$app->post('/auth/setpass/', 'Auth');
$app->post('/auth/signupParams/', 'Auth' );

// Component: Users
$app->post('/users/', 'Users'); 
$app->post('/users/update/', 'Users');
$app->post('/users/single/', 'Users');
$app->post('/users/upsert/', 'Users'); 
$app->post('/users/remove/', 'Users');
$app->get('/users/single/', 'Users');
$app->post('/users/signup/', 'Users'); 
$app->post('/users/approve/', 'Users'); 

// Component: Notifications
$app->post('/notifications/', 'Notifications');
$app->post('/notifications/unread/', 'Notifications');
$app->post('/notifications/read/', 'Notifications');
$app->post('/notifications/readall/', 'Notifications');

// Component: Logs
$app->post('/history/', 'Logs');

// Component: Settings
$app->post('/settings/', 'Settings');
$app->post('/settings/setting/', 'Settings');
$app->post('/settings/update/', 'Settings');

// Component: Comments
$app->post('/comments/', 'Comments');
$app->post('/comments/upsert/', 'Comments' );
$app->post('/comments/remove/', 'Comments' );

// Component: Projects
$app->post('/projects/', 'Projects');
$app->post('/projects/single/', 'Projects');
$app->post('/projects/upsert/', 'Projects');
$app->post('/projects/remove/', 'Projects');

// Component: Issues
$app->post('/issues/', 'Issues');
$app->post('/issues/single/', 'Issues');
$app->post('/issues/upsert/', 'Issues');
$app->post('/issues/remove/', 'Issues');

// Include External Routes
require( FSROOT . "/routes.php" );

// Run
$app->run();


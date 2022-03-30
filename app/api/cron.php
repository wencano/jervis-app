<?php

/**
 * API Entry Point
 *
 * This file loads all the libraries and vendor (external) libraries. The components are registered via the routes (GET and POST). 
 */


session_start();
date_default_timezone_set("UTC"); // Set server timezone

DEFINE('ACCESS', 'site');

// Dependecies
require(dirname(__FILE__) . '/config.php');
require( FSLIBS . 'db.php' );
require( FSLIBS . 'component.php' );
require( FSLIBS . 'helpers.php' );
require( FSLIBS . 'logger.php' );
require( FSLIBS . 'notifier.php' );
require( 'app.php' );

// AJAX CORS
header( 'Access-Control-Allow-Origin: ' . ( isset( $_SERVER['HTTP_ORIGIN'] ) ? $_SERVER['HTTP_ORIGIN'] : '' ) );

// Global $db and $app
$db 	= new Database();
$app 	= new App();
$settings = $app->settings;


/**
 * Remind 
 */
require_once( FSCOM . 'Projects/index.php' );
$className = "ProjectsController";
$res = $className::getInstance()->remind();

echo "<pre>" . print_r($res, true) . "</pre>";
import React from 'react';
import {push as reduxPush, goBack as reduxGoBack} from 'react-router-redux';
import moment from 'moment-timezone';

import store from './store';
import * as $api from './api';
import { DH_NOT_SUITABLE_GENERATOR } from 'constants';

/**
 * History push()
 */
export function push(to) {
	to = to.indexOf("/") == 0 ? to.substring(1) : to;
	store.dispatch( reduxPush(Config.root+to) );
}


/**
 * History goBack()
 */
export function goBack() {
	store.dispatch( reduxGoBack() );
}


/**
 * Get Data from API
 */
export function api(url, params, callback ) {
	fetch( Config.api + ( url || '' ), ( params || {} ) ).then( res => { return res.text()} ).then( raw => {
		let data = JSON.parse( raw );
		callback( data, raw );
	}).catch( err => console.log(err) );
}


/**
 * Post Data to API
 */
export function post( url, params, _callback, errorCallback ) {
	
	url = url.indexOf("/") == 0 ? url.substring(1) : url;
	let api = Config.api + ( url || '' );
	
	jQuery.post( api, (params||{}), function(raw) {
		let res = null;
		
		try {
			res = JSON.parse(raw);
			// $api.setConnected(true);
		}
		
		catch(e) {
			console.log("API Error: ", api, raw );
		}
		
		if( _callback ) _callback(res, raw);
	
	}).error( errorCallback || function(err, status) {
		$api.setLoading(false);
		// $api.setConnected(false);
		alert("ERROR: \nCannot connect to server. Please try again.");
		console.log("Error occured ", status, err.getAllResponseHeaders() );
		if( _callback ) _callback(null, err);
	});
	
}


/**
 * Get Data to API
 */
export function get( url, callback ) {
	fetch( Config.api + ( url || '' ) ).then( res => { return res.text()} ).then( raw => {
		let data = JSON.parse( raw );
		callback( data, raw );
	}).catch( err => console.log(err) );
}


/**
 * Convert Server time to User Timezone
 */
export function tz(datetime) {
	let timezone = store.getState().appdata.user.timezone || 'America/New_York';
	return moment.tz(datetime, 'UTC').clone().tz(timezone);
}


/**
 * Convert Server time to 'America/New_York';
 */
export function tz_ny(datetime) {
	return moment.tz(datetime, 'UTC').clone().tz( 'America/New_York' );
}


/**
 * Project Status Label
 */
export function projectStatusToLabel(status) {
	
	if( status == 0) return (<span className="label label-default">DRAFT</span>);
	else if (status == 1) return (<span className="label label-warning">NEW</span>);
	else if (status == 2) return (<span className="label label-success">ACCEPTED</span>);
	else if (status == 3) return (<span className="label label-info">DISPATCHED</span>);
	else if (status == 4) return (<span className="label label-default">COMPLETED</span>);
	else if (status == -1) return (<span className="label label-danger">CANCELLED</span>);
	else if (status == -2) return (<span className="label label-danger">TRASHED</span>);
	else return null;
}


/**
 *  Project Status to Text
 */
export function projectStatusToText(status) {
	let statusList = ['draft','new', 'accepted', 'dispatched', 'completed'];
	if(status >= 0 ) return statusList[parseInt( status )];
	else if(status == -1 ) return "cancelled";
	else if(status == -2 ) return 'trashed';
}


/**
 *  Project Status to Text
 */
export function projectStatusToColor(status) {
	let colorList = ['default','warning', 'success', 'info', 'default'];
	if( status >= 0 ) return colorList[status];
	else if (status == -1) return "danger";
	else return "default";
}


/**
 * Debug
 */
export function debug() {
	// console.log( ...arguments );
}


/**
 * Prevent Default
 */
export function preventDefault(e) {
	if(e) {e.preventDefault(); e.stopPropagation();}
}


/**
 * Format Address
 */
export function formatAddress($street = '', $city = '', $zip = '', $state = '') {
		
	// Get Tech Distance
	let $address = [];
	if( $street && $street.length ) $address.push($street);
	if( $city && $city.length ) $address.push($city);
	if( $state && $state.length ) $address.push( $state ); 
	if( $zip && $zip.length ) $address.push($zip);
	
	return $address.join(", "); 
}


/**
 * Format Address Require Street
 */
export function formatAddressWithStreet($street = '', $city = '', $zip = '', $state = '') {
	if( $street.trim() == '' ) return '';
	else return formatAddress($street, $city, $zip, $state);
}
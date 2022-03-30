/**
 * Main App API Methods
 */
import * as $api from '../../api';
import * as Helpers from '../../helpers';
import rootStore, { dispatch } from '../../store';	// Root Store
import * as $store from '../../appstore';			// App store
import * as _store from './store';    				// Component store

import _ from 'lodash'; 


const getState = () => rootStore.getState()


/** 
 * Get Users
 */
export const getList = (filters, loading, sort, page, mode, cb ) => {
	let state = rootStore.getState();
	
	filters = filters || getState().users.filters;
	sort = sort || getState().users.sort;
	page = page || getState().users.page;
	
	if(loading) $api.setLoading(true);
	
	Helpers.post( 'users/', {session_key: $api.sessionKey(), filters, sort, page}, res => {
		
		if(res && res.success ) {
			dispatch( _store.setUsers(res.users, mode) );
			dispatch( _store.setFilterParams( res.filterParams ) );
			if( cb ) cb(res);
			else dispatch( _store.setPage( res.pageParams ) );
		}
		
		if(loading) $api.setLoading(false);
	});
}


/**
 * Get User Details
 */
export const getUserDetails = id => {
	let state = rootStore.getState();
	$api.setLoading(true);
	Helpers.post( "users/single/", {session_key: state.appdata.session_key, id: id}, (res, raw) => {
		
		if( res && res.success && res.user ) {
			if( id != 'new' ) dispatch( _store.setUser(res.user) );
		}
		
		if( res ) dispatch( _store.setFilterParams( res.filterParams ) );
			
		
		$api.setLoading(false);
	});
}


/**
 * Upsert User
 */
export const upsertUser = user => {
	let state = rootStore.getState();
	
	// Validate: Disable Multiple Submit
	if( $api.isLoading() ) return false; 
	
	$api.setLoading(true);
	Helpers.post( "users/upsert/", {session_key: state.appdata.session_key, data: user}, (res,raw) => {
		
		if(res && res.success && res.user ) Helpers.push( 'users/' + res.user.id + '/' );
		else if( res && !res.success ) alert("ERROR: " + res.message );
		$api.setLoading(false);
	});
}


/**
 * Update User (by UserProfile)
 */
export const updateUser = (task, userdata) => {
	let state 	= rootStore.getState();
	
	if( $api.isLoading() ) return false; 
	
	$api.setLoading( true );

	Helpers.post( 'users/update/', {session_key: state.appdata.session_key, task: task, data: userdata}, function(res) {
		
		if(res && res.success ) {
			dispatch( $store.setUser(res.user));
			alert("SUCCESS: User " + task + " updated.");
		}
		
		$api.setLoading(false);
			
	});
}


/**
 * Approve/Disapprove New User
 */
export const approve = (user, approve) => {
	
	if(!user || !user.id ) return false; 
	
	$api.setLoading(true);
	Helpers.post( 'users/approve/', {session_key: $api.sessionKey(), user_id: user.id, approve: approve}, (res) => {
		$api.setLoading(false);
		
		if( res.success ) {
			alert("User successfully updated.");
			Helpers.push('users/');
		}
		
	});
	
	
}



/**
 * Remove
 */
export const remove = (id) => {
	if(!id) return false;
	if( $api.isLoading() ) return false; 
	
	if(confirm('Are you sure you want to delete the current item?')) {
		$api.setLoading(true);
		Helpers.post('users/remove/', {session_key: $api.sessionKey(), id: id}, res => {
			
			if(res.success) {
				clear();
				Helpers.push('users/');
			}
			
			else alert('ERROR: Unable to delete the user because it has associated data.');
		});
	}
	
}


/**
 * Rate Increase
 */
export const rateIncrease = (id) => {
	if(!id) return false; 

	$api.setLoading(true);

	Helpers.post('technicians/rate_increase/', {session_key: $api.sessionKey(), user_id: id }, res => {
		
		$api.setLoading(false);
		if(res && res.success) {
			getUserDetails(id);
			alert( res.message || "SUCCESS! Technician's rate has been updated." );
		}
		else alert( res.message || "ERROR! Unable to process request. Please try again later." );
	});

}


/**
 * Close Form 
 */
export const close = (updated, orig) => {
	
	if( ( updated && confirm('There are unsaved changes. Are you sure you want to close this form?')) || !updated ) {
		clear();
		Helpers.push( "users/" + ( orig && orig.id != 'new' ? orig.id + "/" : '' ) ); 
	}
	
}


/**
 * Clear Current Selected
 */
export const clear = () => {
	dispatch( _store.setUser(null) );
}


/**
 * Clear User
 */
export const clearUser = () => {
	dispatch( _store.setUser(null) );
}
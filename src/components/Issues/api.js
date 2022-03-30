/**
 * Main App API Methods
 */
import * as $api from '../../api';
import * as Helpers from '../../helpers';
import $$store, { dispatch } from '../../store';	// Root Store
import * as $store from '../../appstore';			// App store
import * as _store from './store';    				// Component store

import * as storeUsers from '../Users/store';


const getState = () => $$store.getState();



/**
 * Set Filters
 */
export const setFilters = filters => dispatch( _store.setFilters(filters) )


/**
 * Get List
 */
export const getList = ( filters, loading, sort, page, mode, cb ) => {
	
	filters = filters || getState().issues.filters;
	sort = sort || getState().issues.sort;
	page = page || getState().issues.page;
	
	if(loading) $api.setLoading(true);
	
	Helpers.post( 'issues/', {session_key: $api.sessionKey(), filters, sort, page }, (res) => {
		
		if(res && res.success ) {
			console.log(res.issues);
			dispatch( _store.setIssues(res.issues, mode) );
			if( cb ) cb(res);
			else dispatch( _store.setPage( res.pageParams ) );
		}
		
		if( res && res.filterParams ) dispatch( _store.setFilterParams( res.filterParams ) );
		
		if(loading) $api.setLoading(false);
	});
}


/**
 * Get Single
 */
export const getSingle = (id,loading) => {
	
	if(loading) $api.setLoading(true);
	
	Helpers.post( "issues/single/", {session_key: $api.sessionKey(), id: id}, (res, raw) => {
		
		console.log(res)
		if( res && res.success && res.issue ){
			if( id != 'new' ) {
				dispatch( _store.setIssue(res.issue) );
			}
		}
		if( res && res.filterParams ) dispatch( _store.setFilterParams( res.filterParams ) );
		
		if(loading) $api.setLoading(false);
		
	});
	
}


/**
 * Upsert
 */
export const upsert = ( updated, orig, cb ) => {
	
	// Validate: Disable Multiple Submit
	if( $api.isLoading() ) return false; 
	
	// Verify Updated
	if( !updated ) {
		alert("WARNING! No changes were observed.");
		// Helpers.push( "issues/");
		return false;
	}
	
	updated.id = orig.id; 
	
	// Upsert and Redirect
	$api.setLoading(true);
	Helpers.post( 'issues/upsert/', {session_key: $api.sessionKey(), issue: updated}, (res) => {
		if( res && res.success && res.issue ) {
			// Helpers.push( "issues/" );
			if(cb) cb(res);
		}
		else alert("ERROR: Unable to save. Please try again later.");
		$api.setLoading(false);
		
	});
	
}


/**
 * Remove
 */
export const remove = (id, cb) => {
	
	// Validate: Disable Multiple Submit
	if( $api.isLoading() ) return false; 
	
	if(!id) return false;
	
	if(confirm('Are you sure you want to delete the current item?')) {
		$api.setLoading(true);
		Helpers.post('issues/remove/', {session_key: $api.sessionKey(), id: id}, res => {
			
			$api.setLoading(false);
			if( res && res.success ) {
				getList(null, true);
				if(cb) cb(res);
			}
			else alert('ERROR: Unable to delete.');
		});
	}
	
}




/**
 * Close Form 
 */
export const close = (updated, orig) => {
	
	// Validate: Disable Multiple Submit
	if( $api.isLoading() ) return false; 
	
	if( ( updated && confirm('There are unsaved changes. Are you sure you want to close this form?')) || !updated ) {
		clear();
		Helpers.push( "issues/" + ( orig && orig.id != 'new' ? orig.id + "/" : '' ) ); 
	}
	
}

/**
 * Clear Current Selected
 */
export const clear = () => {
	dispatch( _store.setIssue(null) );
}

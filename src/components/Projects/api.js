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
	
	filters = filters || getState().projects.filters;
	sort = sort || getState().projects.sort;
	page = page || getState().projects.page;
	
	if(loading) $api.setLoading(true);
	
	Helpers.post( 'projects/', {session_key: $api.sessionKey(), filters, sort, page }, (res) => {
		
		if(res && res.success ) {
			console.log(res.projects);
			dispatch( _store.setProjects(res.projects, mode) );
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
	
	Helpers.post( "projects/single/", {session_key: $api.sessionKey(), id: id}, (res, raw) => {
		
		console.log(res)
		if( res && res.success && res.project ){
			if( id != 'new' ) {
				dispatch( _store.setProject(res.project) );
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
		Helpers.push( "projects/" + ( orig && orig.id != 'new' ? orig.id + "/" : '' ) );
		return false;
	}
	
	updated.id = orig.id; 
	
	// Upsert and Redirect
	$api.setLoading(true);
	Helpers.post( 'projects/upsert/', {session_key: $api.sessionKey(), project: updated}, (res) => {
		console.log(res)
		if( res && res.success && res.project ) {
			Helpers.push( "projects/" + ( orig && orig.id != 'new' ? orig.id + "/" : '' ) );
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
		Helpers.post('projects/remove/', {session_key: $api.sessionKey(), id: id}, res => {
			
			$api.setLoading(false);
			if(res ) {
				Helpers.push('projects/');
				clear();
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
		Helpers.push( "projects/" + ( orig && orig.id != 'new' ? orig.id + "/" : '' ) ); 
	}
	
}

/**
 * Clear Current Selected
 */
export const clear = () => {
	dispatch( _store.setProject(null) );
}

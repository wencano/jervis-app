/**
 * Main App API Methods
 */
import * as $api from '../../api';
import * as Helpers from '../../helpers';
import $$store, { dispatch } from '../../store';	// Root Store
import * as $store from '../../appstore';					// App store
import * as _store from './store';    						// Component store

export const setFilters = (filters) => {
	dispatch( _store.setFilters( filters ) ); 
}

export const getList = (filters) => {
	
	if(!filters) filters = $$store.getState().comments.filters; 
	
	Helpers.post( 'comments/', {session_key: $api.sessionKey(), filters: filters}, (res) => {
		if(res && res.success) dispatch( _store.set(res.comments) );
		
	});
}

export const upsert = (comment) => {
	Helpers.post( 'comments/upsert/', {session_key: $api.sessionKey(), comment}, (res) => {
		if(res && res.success) dispatch( _store.push(res.comment) );
	});
}

export const remove = (id) => {
	if(!id) return false; 
	Helpers.post( 'comments/remove/', {session_key: $api.sessionKey(), id: id}, (res) => {
		getList();
	});
}
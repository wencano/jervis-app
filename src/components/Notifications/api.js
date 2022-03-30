/**
 * Main App API Methods
 */
import moment from 'moment'; 
import _ from 'lodash'; 

import * as $api from '../../api';
import * as Helpers from '../../helpers';
import $$store, { dispatch } from '../../store';	// Root Store
import * as $store from '../../appstore';					// App store
import * as _store from './store';    						// Component store

export const getList = ( filters, limit ) => {
	
	filters = filters || $$store.getState().notifications.filters; 
	limit = limit || $$store.getState().notifications.limit; 
	
	$api.setLoading(true);
	Helpers.post( 'notifications/', {session_key: $$store.getState().appdata.session_key, filters: filters, limit: limit }, (res) => {
		if(res && res.success) dispatch( _store.set(res.notifications) );
		$api.setLoading(false);
	}, (err, status) => (false));
}

export const getUnread = (project_id) => {
	Helpers.post( 'notifications/unread/', {session_key: $$store.getState().appdata.session_key}, (res) => {
		if(res && res.success) dispatch( _store.setUnread(res.notifications) );
	}, (err, status) => (false) );
}

export const read = (id, e) => {
	
	if( !id ) return false; 
	
	let state = $$store.getState();
	
	// Set Notifications
	let notifs = _.map( state.notifications.notifications, (notif,i)=>{ 
		if(notif.id == id) notif.date_read = moment().format("YYYY-MM-DD HH:MM:SS");
		return notif; 
	});
	
	// Set Unread
	let unread = _.map( state.notifications.unread, (notif,i)=>{ 
		if(notif.id == id) notif.date_read = moment().format("YYYY-MM-DD HH:MM:SS");
		return notif; 
	});
	
	// Set in Unread
	dispatch( _store.setRead( {notifications: notifs, unread: unread } ) );
	
	Helpers.post('notifications/read/', {session_key: $api.sessionKey(), id: id});  
	
}


export const readAll = () => {
	
	let state = $$store.getState();
	
	// Set Notifications
	let notifs = _.map( state.notifications.notifications, (notif,i)=>{ 
		notif.date_read = moment().format("YYYY-MM-DD HH:MM:SS");
		return notif; 
	});
	
	// Set Unread
	let unread = _.map( state.notifications.unread, (notif,i)=>{ 
		notif.date_read = moment().format("YYYY-MM-DD HH:MM:SS");
		return notif; 
	});
	
	// Set in Unread
	dispatch( _store.setRead( {notifications: notifs, unread: unread } ) );
	
	Helpers.post('notifications/readall/', {session_key: $api.sessionKey()} );  
	
}
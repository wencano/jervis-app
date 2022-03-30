/**
 * Main App API Methods
 */
import _ from 'lodash'; 

import * as $api from '../../api';
import * as Helpers from '../../helpers';
import $$store, { dispatch } from '../../store';	// Root Store
import * as $store from '../../appstore';			// App store
import * as _store from './store';    				// Component store

export const get = () => {
	$api.setLoading(true);
	Helpers.post( 'settings/', {session_key: $$store.getState().appdata.session_key}, res => { 
		if(res && res.success) dispatch( _store.set(res.settings) );
		else alert('ERROR: Unable to load settings.');
		$api.setLoading(false);
	});
}

export const setting = (key, loading) => {
	if(loading) $api.setLoading(true);
	Helpers.post( 'settings/setting/', {session_key: $$store.getState().appdata.session_key, setting_key: key}, res => {
		if(res && res.success) {
			let settings = _.cloneDeep( $$store.getState().settings.settings );
			settings[ key ] = $res[ key ];
			dispatch( _store.set(settings) );
		}
		if(loading) $api.setLoading(false);
	});
}

export const set = ( settings, cb ) => {
	$api.setLoading(true);
	Helpers.post( 'settings/update/', {session_key: $$store.getState().appdata.session_key, settings: settings}, (res) => {
		
		dispatch( _store.set(res.settings) );
		if(cb) cb(res);
		
		Helpers.push( 'settings/' );
		$api.setLoading(false);
		
		
	});
}
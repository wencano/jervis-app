/**
 * Main App API Methods
 */
import * as $api from '../../api';
import * as Helpers from '../../helpers';
import $$store, { dispatch } from '../../store';	// Root Store
import * as $store from '../../appstore';					// App store
import * as _store from './store';    						// Component store

export const get = (filters) => {
	$api.setLoading(true);
	Helpers.post( 'history/', {session_key: $api.sessionKey(), filters: filters}, (res) => {
		if(res && res.success) dispatch( _store.set(res.logs) );
		$api.setLoading(false);
	});
}
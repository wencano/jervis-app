/**
 * Main App API Methods
 */
import * as $api from '../../api';
import * as Helpers from '../../helpers';
import $$store, { dispatch } from '../../store';	// Root Store
import * as $store from '../../appstore';					// App store
import * as _store from './store';    						// Component store

export const getList = () => {
	$api.setLoading(true);
	Helpers.post( 'dashboard/', {session_key: $api.sessionKey()}, (res) => {
		$api.setLoading(false);
		if(res && res.success) dispatch( _store.set(res.dashboard) );
	}, (res)=>(false) );
}
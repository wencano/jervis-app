/**
 * Main App Reducers
 */

/**
 * Main App Reducers
 * also include common reducers
 */
const initialState = {
	root: 	Config.root,
	api:		Config.api,
	connected: true, 
	session_key:	window.localStorage.getItem(Config.name + '_session_key'),
	reset_link_verified: false,
	last_update: null,
	user: { 
		id: 0, 
		name: "Guest",
		type: 'technician'
	}, 
	userLoaded: false, 
	page: '',
	loading: true,
	property: null,
	params: {},
	UIModal: null,
	signupParams: null
};

	
// Action Name Creator
const createActionName = name => `app/${name}`;


// Reducer (to be registered in ./app/store.js)
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    
		case _SET: 
			return action.payload;
			
    case _LOADING: 
			let isLoading = action.payload == null ? !state.loading : action.payload;
			return {...state, loading: isLoading};
		
		case _CONNECTED:
			return {...state, connected: action.payload};
		
		case _SESSION:
			return {...state, ...action.payload};
		
		case _USER:
			return {...state, user: action.payload };
			
		case _PAGE:
			return {...state, page: action.payload};
		
		case _PROPERTY:
			return {...state, property: action.payload};
			
		case _PARAMS:
			return {...state, params: action.payload};
			
		case _MODAL:
			return {...state, UIModal: action.payload };
			
		case RESET_LINK_VERIFIED:
			return {...state, reset_link_verified: action.payload };
		
		case SIGNUP_PARAMS: 
			return {...state, signupParams: action.payload };
		
    default:
      return state;
		
  }
}


// Actions
export const _SET = createActionName("set");
export const _LOADING = createActionName("loading");
export const _CONNECTED = createActionName("connected");
export const _SESSION = createActionName("session");
export const _USER = createActionName("user");
export const _PAGE = createActionName("page");
export const _PROPERTY = createActionName("property");
export const _PARAMS = createActionName("params");
export const _MODAL = createActionName("modal");
export const RESET_LINK_VERIFIED = createActionName('reset_link_verified');
export const SIGNUP_PARAMS = createActionName( 'signup_params' );


// Action Creators
export const set = payload => ({type: _SET, payload});
export const setLoading = payload => ({ type: _LOADING, payload });
export const setConnected = payload => ({ type: _CONNECTED, payload });
export const setSession = payload => ({type: _SESSION, payload});
export const setUser = payload => ({type: _USER, payload});
export const setPage = payload => ({type: _PAGE, payload});
export const setProperty = payload => ({type: _PROPERTY, payload});
export const setParams = payload => ({type: _PARAMS, payload});
export const setModal = payload => ({type: _MODAL, payload });
export const setResetLinkVerified = payload => ({type: RESET_LINK_VERIFIED, payload});
export const setSignupParams = payload => ({type: SIGNUP_PARAMS, payload})
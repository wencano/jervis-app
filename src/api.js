/**
 * Main App API Methods
 */
import * as Helpers from './helpers';
import $$store, { dispatch } from './store';
import * as $store from './appstore';


/**
 * App Helpers
 */
// Get Store State
export const getStore = (component) => ( component ? $$store.getState()[component] : $$store.getState() )

// Set Connected
export const setConnected = (connected) => dispatch( $store.setConnected( connected ) )

// Loading Spinner Helpers
export const setLoading = (v) => dispatch( $store.setLoading(v) );
export const setPage = (p) => dispatch( $store.setPage(p) );
export const setProperty = (p) => dispatch( $store.setProperty(p) );
export const isLoading = () => ( $$store.getState().appdata.loading );

// Modal Helpers
export const setModal = (Child, params) => {
	dispatch( $store.setModal({params: params, Child: Child} ) ) 
}

// User Helpers
export const userLoaded = () => ( $$store.getState().appdata.userLoaded )
export const is = (type) => ( $$store.getState().appdata.user.type === type )
export const userId = () => ( $$store.getState().appdata.user.id )
export const userType = () => ($$store.getState().appdata.user.type)
export const sessionKey = () => $$store.getState().appdata.session_key
export const allowed = ( userTypes ) => {
	let appdata = $$store.getState().appdata;
	if( !appdata.userLoaded ) return false; 
	else if (!appdata.user.type) return false; 
	else if ( userTypes.indexOf( appdata.user.type ) > -1 ) return true; 
	else return false; 
}
export const setLayout = ( user_type ) => {
	if( user_type == 'technician' ) $('body').addClass('layout-top-nav');
	else $('body').removeClass('layout-top-nav');
	
	if( user_type == 'admin' && $('body').hasClass('skin-blue') ) {
		// $('body').removeClass('skin-blue');
		// $('body').addClass('skin-red');
	}
	else {
		//$('body').addClass('skin-blue');
		//$('body').removeClass('skin-red');
	}
}


/**
 * Auth Actions
 */

 // Check Session
export const checkSession = (session_key) => {
	
	setLoading(true);
	
	Helpers.post( '', {session_key: session_key}, ( res, raw ) => {
		setLoading();
		if( res && res.success && res.user ) {
			let userLoaded = res.user && res.user.id > 0 ? true : false; 
			setLayout( res.user.type );
			dispatch( $store.setSession( { user: res.user, userLoaded: userLoaded } ) );
		}
		
		else console.log(raw);
	}); 
	
}

// Login
export const login = (u) => {
	
	setLoading(true);
	
	Helpers.post( '', {email: u.email, pass: u.pass, task: 'login'}, function(res, raw) {
		
		setLoading(false);
		if(res && res.success) {
			window.localStorage.setItem( Config.name + '_session_key', res.session_key );
			window.localStorage.setItem( Config.name + '_user_type', res.user.type );
			setLayout( res.user.type );
			dispatch( $store.setSession( {session_key: res.session_key, user: res.user, userLoaded: true } ) );
		}
		else if ( res && !res.success ) alert("ERROR! The account is either not available or does not exist.");
		else console.log(raw);
		
	}); 
	
}

// Logout
export const logout = (e) => {
	
	if(e) {e.preventDefault(); e.stopPropagation();}
	
	setLoading(true);
	
	
	// Send Logout
	Helpers.post( '', {task: 'logout', session_key: window.localStorage.getItem( Config.name + '_session_key' ) }, () => {
		setTimeout( ()=>{
			// Reset State
			window.localStorage.removeItem( Config.name + '_session_key');
			window.localStorage.removeItem( Config.name + '_user_type' );
			dispatch( $store.setSession({session_key: null, user: { id: 0,	name: "Guest" }, userLoaded: false }) );
			setLoading(false);
			Helpers.push( '' );
		}, 500 );
	} ); 
		
}


// Reset Password
export const reset = (email) => {
	
	if(!email) return false;
	
	setLoading(true);
	Helpers.post( 'auth/reset_password/', {email: email}, (res) => {
		setLoading(false);
		
		if(res && res.success) alert("Reset link has been sent to your email. Please open the reset link to continue with the password reset process.");
		else if ( res && !res.success ) alert("The email address could not be found.");
		else alert("ERROR: Server error. Please try again later.");
		Helpers.push('');
		
	});
	
}


// Verify Reset Key
export const verify = (reset_key) => {
	
	if(!reset_key) return false; 
	
	setLoading(true);
	Helpers.post( 'auth/verify_reset_password/', {reset_key: reset_key}, (res) => {
		
		setLoading(false);
		
		if(res && res.success) dispatch( $store.setResetLinkVerified(true) );
		else {
			alert('ERROR: The link is invalid or has expired. Please try again.');
			Helpers.push('');
		}
		
	});
	
}


// Set Password
export const setpass = (data) => {
	
	if(!data) return false; 
	
	setLoading(true);
	Helpers.post('auth/setpass/', data, (res) => {
		setLoading(false);
		
		if(res && res.success ) {
			alert( res.message );
			Helpers.push('');
		}
		
		else alert( res.message );
		
	});
	
}


// Sign Up Config
export const signupParams = () => {
	setLoading(true);
	
	// Initialize with Temporary values
	dispatch($store.setSignupParams({categories: [], locations: [] }) );
	
	Helpers.post( 'auth/signupParams/', {}, (res) => {
		setLoading(false);
		
		if(res && res.success) dispatch( $store.setSignupParams( res.params ) );
		
	});
	
}


// Signup
export const signup = (u) => {
	
	// Validate
	let errors = [];
	if( !u.name_first.trim().length ) errors.push( "No first name."); 
	if( !u.name_last.trim().length ) errors.push( "No last name. ");
	if( !u.email.trim().length ) errors.push( "No email address.");
	if( !u.pass.trim().length || u.pass.length < 5 ) errors.push( "Password should be 5 characters or more." );
	if( !u.categories.length ) errors.push( "No capabilities selected.");
	if( !u.locations.length ) errors.push( "No location selected.");
	if(errors.length) {
		alert("ERROR! Please fix the following issues: \n- " + errors.join("\n- ") );
		return false; 
	}
	
	// Send
	setLoading(true);
	Helpers.post( 'users/signup/', {data: u}, (res) => {
		setLoading(false);
		if(res && res.success) Helpers.push( 'signup/success/' );
		else {
			alert( res.message );
		}
	});
	
}

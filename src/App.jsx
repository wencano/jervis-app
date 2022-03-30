/**
 * Main App Component
 *
 */

import React 		from 'react';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';


// Component Imports
import * as Helpers from './helpers';
import * as $store from './appstore';
import * as $api from './api';
import * as apiNotifications from './components/Notifications/api';


// App Container
import Header 	from './tmpl/Header.jsx';
import Sidebar 	from './tmpl/Sidebar.jsx';
import Footer 	from './tmpl/Footer.jsx';
import Auth 	from './tmpl/Auth.jsx';

import Spinner 	from './tmpl/Spinner.jsx';
import UIModal	from './tmpl/Modal.jsx';


// Notification Thread
window.notifThread = null;


/**
 * Map Store State to Props
 */
const mapStateToProps = state => { 
	return { appdata: state.appdata, properties: state.properties }; 
};


/**
 * Map Actions
 */
const mapDispatchToProps = dispatch => {
  return {
    setData: appdata => dispatch( $store.set(appdata) ),
		setLoading: loading => dispatch( $store.setLoading( loading ) ),
		setParams: params => dispatch( $store.setParams(params) )
  };
};


/**
 * AppComponent
 */
class _App extends React.Component {
	
	
	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		
		this.state = {
			notificationThread: null, 
			UIModal: null
		}
		
		this.setModal 		= this.setModal.bind(this);
		this.afterModalClose = this.afterModalClose.bind(this);
		
	}
	
	
	/**
	 * Set Modal
	 */
	setModal( ModalChild, data ) {
	
		if( ModalChild ) {
			this.state.UIModal = {
				ModalChild: ModalChild,
				data: data
			}
		}
		
		else {
			this.state.UIModal = null;
		}
		
		this.setState(this.state);
		
	}
	
	
	/**
	 *  After Modal Close
	 */
	afterModalClose() {
		this.setModal(null);
	}
	
	
	/**
	 * Render
	 */
	render() {
		let _this = this;
		let appdata = this.props.appdata;
		let isLoggedIn = appdata.user.id;
		
		let state = this.state; 
		
		if( isLoggedIn ) {
			return (
				<div>
					<Header />
					{ appdata.user.type == 'admin' || appdata.user.type == 'dispatcher' ? <Sidebar /> : null }
					
					{React.Children.map(_this.props.children, function(child) {
						return React.cloneElement(child, {setModal: _this.setModal });
					})}
					
					<Footer />
					
					{/** Global Modal */}
					{ state.UIModal ? <UIModal data={state.UIModal.data} ModalChild={state.UIModal.ModalChild} afterModalClose={this.afterModalClose} /> : null }
					
					{/** Global Overlay Loading */}
					{ appdata.loading ? <Spinner /> : null }
					
				</div>
			);
			
		}
		
		
		else {
			return (
				<div>
					<Auth {...this.props} />
					
					{/** Global Overlay Loading */}
					{appdata.loading ? 
						<div className="overlay-wrapper">
							<div className="overlay">
								<i className="fa fa-refresh fa-spin"></i>
							</div>
						</div> : null 
					}
				</div>
			);
		}
		
	}
	
	componentWillMount() {
		if( this.props.appdata.session_key ) $api.checkSession( this.props.appdata.session_key );
		else this.props.setLoading(false);
		
	}
	
	componentDidMount() {
		//$api.setConnected(false);
		apiNotifications.getUnread();
		
		// FEATURE_TECHNICIAN
		if( window.localStorage.getItem( Config.name + '_user_type') == 'technician' ) $('body').addClass('layout-top-nav');
		
	}
	
	componentWillReceiveProps(nextProps) {
		
		
	}
	
	componentDidUpdate() {
		
		// Recalculate Layout
		$(function(){
			$.AdminLTE.layout.fix();
			$('.anim').addClass('anim-go');
		});
		
		// Monitor Notifications
		if( this.props.appdata.user.id != 0 && !notifThread ) notifThread = setInterval(()=>apiNotifications.getUnread(), 5000 );
		
		else if ( this.props.appdata.user.id == 0 && notifThread ) { clearInterval( notifThread ); notifThread = null; }
		
		// Adjust Top Nav for Technician
		if( $api.allowed('technician') && !$('body').hasClass('layout-top-nav') ) 
			$('body').addClass('layout-top-nav');
		
	}
	
	
	componentWillUnmount() {
		
	}
	
	
	
	
}


const App = connect(mapStateToProps, mapDispatchToProps)(_App); 
export default App;
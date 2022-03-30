import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';

import * as Helpers from '../../helpers';
import * as $api from '../../api';
import * as _api from './api'; 
import * as apiNotifications from '../Notifications/api';
import * as apiUsers from '../Users/api';


/**
 * Map Store State to Props
 */
const mapStateToProps = state => { 
	return { 
		session_key: state.appdata.session_key, 
		user: state.appdata.user,
		
		dashboard: state.dashboard.dashboard, 
		
		users: state.users.users,
		userFilters: state.users.filters,
		
		notifications: state.notifications.notifications,
		
		path: state.routing.locationBeforeTransitions.pathname
	}
};

class _Dashboard extends React.Component {
	
	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		
		
	}
	
	
	/**
	 * Render Component
	 */
  render() {
		let state = this.state; 
		let props = this.props;
		
		return (
			<div className="content-wrapper">
				
				<section className="content-header">
					
					<div className="pull-left">
						<h1 style={{margin: '0'}}>{$api.userType().ucwords()} Dashboard</h1>
					</div>
					
					<div className="pull-right box-tools"></div>
					
					<div style={{clear: 'both'}}></div>
				</section>
				
			</div>
		);
	}
	
	
	/**
	 * Before Component Mount
	 */
	componentWillMount() {
		
		// Get Dashboard Counters
		_api.getList();		
		
		// Get Notifications
		apiNotifications.getList(null, 25); 
		
		// Set Navigation
		$api.setPage('');
		
	}
	
	/**
	 * Update New Props
	 */
	componentWillReceiveProps(nextProps) {
		
	}
	
}


/**
 * Export Component
 */
const Dashboard = connect(mapStateToProps)(_Dashboard); 
export default Dashboard;
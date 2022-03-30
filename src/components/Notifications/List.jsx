import React, {Component, PropTypes} 		from 'react';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';

import * as Helpers from '../../helpers';
import * as $api from '../../api';
import * as _api from './api';

import NotificationsTable from './Table.jsx';

const mapStateToProps = state => {
	return {notifications: state.notifications.notifications};
}

class _Notifications extends React.Component {
	
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
				
				{/** FEATURE_TECHNICIAN: Add Container for full-width */}
				<div className={ $api.is('technician') ? 'container' : '' }>
				
				<section className="content-header">
					
					<div className="pull-left">
						<h1 style={{margin: '0'}}><i className="fa fa-bell"></i> Notifications</h1>
					</div>
					
					<div className="pull-right box-tools"></div>
					
					<div style={{clear: 'both'}}></div>
				</section>
				
				
				<section className="content">
					<div className="row">
						<div className="col-sm-8">
							<NotificationsTable />
						</div>
						
					</div>
				</section>
				
				
				</div>
				
			</div>
		);
	}
	
	
	/**
	 * Before Component Mount
	 */
	componentWillMount() {
		_api.getList();
		$api.setPage('notifications');
	}
	
	/**
	 * Update New Props
	 */
	componentWillReceiveProps(nextProps) {
		
	}
	
}


const Notifications = connect(mapStateToProps)(_Notifications); 
export default Notifications;
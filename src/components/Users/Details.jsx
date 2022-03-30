import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from "react-redux"; 
import _ 				from 'lodash';
import moment 	from 'moment';

import * as Helpers from '../../helpers';
import * as $api from '../../api';
import * as _api from './api';
import * as _store from './store';


import NotFound from '../../tmpl/404.jsx';

import LogsTable from '../Logs/Table.jsx';
import Availability from './Availability.jsx';

const mapStateToProps = (state) => {
	return { 
		user: state.users.user, 
		userDefault: state.users.userDefault, 
		filters: state.users.filters,
	}; 
}


/**
 * Map Dispatch to Props
 */
const dispatchToProps = dispatch => {
	return {
		setFilters: (filters, component) => dispatch( _store.setFilters(filters, component) ),
		setSort: (sort, component) => dispatch( _store.setSort(sort, component) ),
		setPage: (page, component) => dispatch( _store.setPage(page, component ) )
	}
}


class _UserDetails extends React.Component {
	
	
	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		
		this.state = {tab: 'details'};
		
		this.getList = this.getList.bind(this);
		this.tabFilter = this.tabFilter.bind(this);
		
	}
	
	
	/**
	 * Get List
	 */
	getList( component, mode ) {
		
		// Get Params Directly from Store to ensure updated data
		let {filters, sort, page} = component ? $api.getStore('users')[component] : $api.getStore('users');
		
		let tech_id = this.props.params.id;
		filters.tech_id = tech_id; 
		
		
	}
	
	
	/**
	 * Tab Filter
	 */
	tabFilter( tab ) {
		
		
		
		_api.getUserDetails( this.props.params.id );
		
	}
	
	
	
	/**
	 * Render Component
	 */
  render() {
		
		if( $api.allowed([ 'admin', 'dispatcher' ] ) ) {
			
			let props = this.props;
			let user = props.user || _.cloneDeep( props.userDefault ); 
			
			if( user.type == 'technician' && user.status == -1 && !$api.is('admin') ) {
				return ( 
					<div className="content-wrapper">
						<div className="content-top">
							<ul>
								<li><Link to={Config.root} className="" >Home</Link></li>
								<li><Link to={Config.root + "users/"} className="" >Users</Link></li>
								<li><Link to={window.location.href} className="active" >{user.name}</Link></li>
							</ul>
						</div>
						
						
						<section className="content-header">
							
							<div className="pull-left">
								<h1 style={{margin: '0'}}>Restricted</h1>
							</div>
							
						</section>
					</div>
				);
			}
			
			return (
				<div className="content-wrapper">
					
					<div className="content-top">
						<ul>
							<li><Link to={Config.root} className="" >Home</Link></li>
							<li><Link to={Config.root + "users/"} className="" >Users</Link></li>
							<li><Link to={window.location.href} className="active" >{user.name}</Link></li>
						</ul>
					</div>
					
					
					<section className="content-header">
						
						<div className="pull-left">
							<h1 style={{margin: '0'}}>{user.name}<br /><small><i className="fa fa-user"></i> {user.type.ucwords()}</small></h1>
						</div>
						
						
						<div className="pull-right box-tools"> 

							{/** Edit User */}
							{ user.status > -1 && $api.allowed( ['admin'] ) ? 
								<Link to={Config.root + "users/" + user.id + "/edit/"} className="btn btn-flat btn-sm btn-primary pull-left" style={{marginLeft: '10px'}}><i className="fa fa-pencil"></i> Edit</Link>
								: null 
							}

							{/** Rate Increase for Technicians */}
							{ $api.allowed(['admin']) && user.type == 'technician' ? 
								<button type="button" className="btn btn-flat btn-sm btn-primary" onClick={(e)=>_api.rateIncrease(user.id)}>Update Rate</button>
								: null
							}

						</div>

						
						
						<div style={{clear: 'both'}}></div>
					</section>
					
					
					<section className="content">
						<div className="row">
							<div className="col-md-12">
								
								<div className="nav-tabs-custom">
									<ul className="nav nav-tabs">
										<li className={ props.route.tab == '' ? "active" : '' } >
											<Link to={Config.root + 'users/' + user.id + '/'}>Details</Link>
										</li>
																				
										<li className={ props.route.tab == 'logs' ? 'active' : '' }>
											<Link to={Config.root + 'users/' + user.id + '/logs/'}>History</Link>
										</li>
										
									</ul>
									<div className="tab-content no-padding">
										<div className="tab-pane table-responsive active" id="details" >
											
											{/** Tab: Details */}
											{props.route.tab == '' ? 
												<div className="row " style={{marginLeft: 0, marginRight: 0, margin: '40px 0'}}>
													<div className="col-md-6">
														
														<div className="row">
															<div className="col-xs-4"><b>Name:</b></div>
															<div className="col-xs-8">{user.name}</div>
														</div>
														<hr className="hr-narrow" />
														
														<div className="row">
															<div className="col-xs-4"><b>Email:</b></div>
															<div className="col-xs-8">{user.email}</div>
														</div>
														<hr className="hr-narrow" />
														
														<div className="row">
															<div className="col-xs-4"><b>Slack ID:</b></div>
															<div className="col-xs-8">{user.slack_email}</div>
														</div>
														<hr className="hr-narrow" />
														
														<div className="row">
															<div className="col-xs-4"><b>Phone No.:</b></div>
															<div className="col-xs-8">{user.phone}</div>
														</div>
														<hr className="hr-narrow" />
														
														<div className="row">
															<div className="col-sm-4"><b>Notes:</b></div>
															<div className="col-sm-8">{user.notes}</div>
														</div>
														
													</div> 
													
													<div className="col-sm-6" >
														
														<div className="visible-xs" style={{paddingTop: 20, borderTop: '1px solid #dedede'}}>&nbsp;</div>
														
														
														
													</div>
												
												</div>
												: null
											}
											
											{/** Tab: Logs */}
											{props.route.tab == 'logs' ? 
												<div className="row" style={{margin: '20px'}}>
													<LogsTable filters={{user_id: user.id}} />
												</div> : null 
											}
											
											
											
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					
				</div>
			);
			
		}
		
		else return <NotFound />
		
	}
	
	
	/**
	 * Before Component Mount
	 */
	componentWillMount() {
		if( $api.allowed( ['admin', 'dispatcher'] ) ) {
			_api.getUserDetails( this.props.params.id );
			
			this.tabFilter( this.props.route.tab );
			
		}
		$api.setPage('users');
	}
	
	/**
	 * Component Will Receive Props
	 */
	componentWillReceiveProps(props) {
		
		if( this.props.route.tab != props.route.tab ) 
			this.tabFilter( props.route.tab );
		
		if( this.props.params.id != props.params.id )
			_api.getUserDetails( props.params.id );
		
		
	}
	
	componentWillUnmount() { _api.clearUser() }
	
}


const UserDetails = connect(mapStateToProps, dispatchToProps)(_UserDetails); 
export default UserDetails;
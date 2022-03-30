import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';

import * as Helpers from '../../helpers';
import * as $api from '../../api';
import * as _api from './api';
import * as _store from './store';

import NotFound from '../../tmpl/404.jsx';
import UsersTable from './Table.jsx';
import Pagination from '../Commons/Pagination.jsx';


/**
 * Map Store State to Props
 */
const mapStateToProps = state => { 
	return { 
		session_key: state.appdata.session_key, 
		
		user: state.appdata.user,
		users: state.users.users,
		
		filters: state.users.filters,
		filtersDefault: state.users.filtersDefault,
		filterParams: state.users.filterParams, 
		
		page: state.users.page,
		sort: state.users.sort,
		
		path: state.routing.locationBeforeTransitions.pathname
	}
};


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


class _Users extends React.Component {
	
	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		
		this.getList = this.getList.bind(this);
		this.tabFilter = this.tabFilter.bind(this);
		
	}
	
	
	/**
	 * Get List
	 */
	getList( component, mode ) {
		
		// Get Params Directly from Store to ensure updated data
		let {filters, sort, page} = component ? $api.getStore('users')[component] : $api.getStore('users');
		_api.getList( filters, true, sort, page, mode );
		
	}
	
	
	/**
	 * Tab Filter
	 */
	tabFilter(tab, component) {
		let props = this.props; 
		let filters = component ? props[component].filters : props.filters;
		
		filters.type = tab || $api.getStore('users').filters.type;
		
		props.setFilters(filters, component);
		this.getList(component);
		
	}
	
	
	/**
	 * Render Component
	 */
  render() {
		if( $api.allowed( ['admin', 'dispatcher'] ) ) {
			let state = this.state;
			let props = this.props; 
			
			return (
				<div className="content-wrapper">
					
					<div className="content-top">
						<ul>
							<li><Link to={Config.root} className="" >Home</Link></li>
							<li><Link to={Config.root + "users/" } className="active" >Users</Link></li>
						</ul>
					</div>
					
					<section className="content-header">
						<div className="pull-left">
							<h1 style={{margin: '0'}}>
								Manage Users
							</h1>
						</div>
						
						<div className="pull-right box-tools">
						{$api.allowed( ['admin'] ) ? <Link to={Config.root + "users/new/"} className="btn btn-flat btn-sm btn-primary pull-left" style={{marginLeft: '10px'}}><i className="fa fa-plus"></i> Add</Link> : null }
						</div>
						
						<div style={{clear: 'both'}}></div>
					</section>
					
					
					<section className="content">
						<div className="row">
							<div className="col-md-12">
								<div className="nav-tabs-custom">
									<ul className="nav nav-tabs">
										{$api.allowed(['admin']) ? 
											<li className={ props.filters && props.filters.type == "admin" ? 'active' : '' }>
												<Link to={Config.root + "users/admins/"}>Admins</Link>
											</li> : null
										}
										<li className="pull-right">
											<Pagination page={props.page} setPage={props.setPage} getList={this.getList} />
										</li>
									</ul>
									<div className="tab-content">
										<div className="tab-pane active" id="tab_1" >
											
											<UsersTable 
												users={props.users} 
												filterParams={props.filterParams} 
												filters={props.filters} setFilters={props.setFilters}
												sort={props.sort} setSort={props.setSort}
												page={props.page} setPage={props.setPage}
												getList={this.getList}
												/>
											
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
		
		if( $api.allowed( ['admin', 'dispatcher'] ) )
			this.tabFilter(this.props.route.tab);
		
		$api.setPage('users', true);
	}
	
	
	/**
	 * Update New Props
	 */
	componentWillReceiveProps(props) {
		
		if( JSON.stringify(this.props) != JSON.stringify(props) ) {
			if( $api.allowed( ['admin', 'dispatcher'] ) ) {
				
				if( this.props.route.tab !== props.route.tab ) 
					this.tabFilter( props.route.tab );
				
			}
		}
		
	}
	
}



/**
 * Export Component
 */
const Users = connect( mapStateToProps, dispatchToProps )(_Users); 
export default Users;
import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from "react-redux"; 
import _ 				from 'lodash';
import moment 	from 'moment-timezone';

import * as Helpers from '../../helpers';
import * as $api from '../../api';
import * as _api from './api';
import * as _store from './store';
import * as apiUsers from '../Users/api';

import LogsTable from '../Logs/Table.jsx';
import CommentsList from '../Comments/List.jsx'; 

import Pagination from '../Commons/Pagination.jsx';

const mapStateToProps = (state) => {
	return { 
		user: state.appdata.user, 
		issue: state.issues.issue, 
		options: state.issues.options,
		issueDefault: state.issues.issueDefault, 
		filters: state.issues.filters
		
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

class _IssueDetails extends React.Component {

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
		let {filters, sort, page} = component ? $api.getStore('issues')[component] : $api.getStore('issues');
		let id = this.props.params.id;
		filters.id = id; 

	}
	
	/**
	 * Tab Filter
	 */
	tabFilter( tab ) {
		if (tab == '' ) {
			_api.getSingle( this.props.params.id );

		}
	}

	/**
	 * Render Component
	 */
  render() {
		
		let props = this.props;
		let issue = props.issue || _.cloneDeep( props.issueDefault ); 
		let options = props.options;
		let hasissue = issue && issue.id && issue.id != 'new' && issue.id != '' ? true : false;
		
		return (
			<div className="content-wrapper">
				
				<div className="content-top">
					<ul>
						<li><Link to={Config.root} className="" >Home</Link></li>
						<li><Link to={Config.root + "issues/"} className="" >Issues</Link></li>
						<li><Link to={window.location.href} className="active" >{issue.id}</Link></li>
					</ul>
				</div>
				
				<section className="content-header">
					
					<div className="pull-left">
						<h1 style={{margin: '0'}}>{!hasissue ? "Issue Not Found" : issue.title}</h1>
					</div>
					
					{ hasissue && $api.allowed(['admin']) ? 
						<div className="pull-right box-tools">
							
							{$api.allowed( ['admin'] ) ? 
								<Link to={Config.root + "issues/" + issue.id + "/edit/"} className="btn btn-flat btn-sm btn-primary pull-left" style={{marginLeft: '10px'}}><i className="fa fa-pencil"></i> Edit</Link> : null
							}
							
							<button className="btn btn-default btn-sm btn-flat" onClick={(e)=>_api.close()} >Close</button>
						</div>
						: null
					}
					
					<div style={{clear: 'both'}}></div>
				</section>

				<section className="content ">
					<div className="row">
						<div className="col-md-12">
							
							<div className="nav-tabs-custom">
								<ul className="nav nav-tabs">
									
									<li className={ props.route.tab == '' ? "active"  : ''} >
										<Link to={ Config.route + 'issues/' + issue.id + '/' }>Details</Link>
									</li>
								</ul>
								<div className="tab-content">
									<div className="tab-pane active" id="details" >
																					
										{/** 
											*	Details Tab 
											*/}
										{issue && issue.id ? 
											<div className="row " style={{marginLeft: 0, marginRight: 0, margin: '0 5px 40px 0' }}>
												
												{/** ISSUE INFO */}
												<div className="col-md-6" >

												<div className="row">
														<div className="col-xs-4"><b>Issue title:</b></div>
														<div className="col-xs-8">{ issue.title }</div>
													</div> <hr className="hr-narrow" />
													
													<div className="row">
														<div className="col-xs-4"><b>Customer Name:</b></div>
														<div className="col-xs-8">{issue.customer_name}</div>
													</div> <hr className="hr-narrow" />
											</div>
											</div>
										: null }
										</div>
									</div>
								</div>
								</div>
								</div>
							</section>
						</div>
		);
	}
	
	/**
	 * Before Component Mount
	 */
	componentWillMount() {
		let props = this.props; 
		_api.getSingle( props.params.id );
	
		$api.setPage('issues');
	}
	
	/**
	 * Update New Props
	 */
	componentWillReceiveProps(props) {
		if(JSON.stringify(this.props) != JSON.stringify(props) ) {
			if( this.props.route.tab != props.route.tab ) 
				this.tabFilter( props.route.tab );
		}
		
		
	}
	
	componentWillUnmount() { _api.clear() }
}


const IssueDetails = connect(mapStateToProps, dispatchToProps)(_IssueDetails); 
export default IssueDetails;
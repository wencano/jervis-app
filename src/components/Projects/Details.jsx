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
		project: state.projects.project, 
		options: state.projects.options,
		projectDefault: state.projects.projectDefault, 
		filters: state.projects.filters
		
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

class _ProjectDetails extends React.Component {

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
		let {filters, sort, page} = component ? $api.getStore('projects')[component] : $api.getStore('projects');
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
		let project = props.project || _.cloneDeep( props.projectDefault ); 
		let options = props.options;
		let hasproject = project && project.id && project.id != 'new' && project.id != '' ? true : false;
		
		return (
			<div className="content-wrapper">
				
				<div className="content-top">
					<ul>
						<li><Link to={Config.root} className="" >Home</Link></li>
						<li><Link to={Config.root + "projects/"} className="" >Projects</Link></li>
						<li><Link to={window.location.href} className="active" >{project.id}</Link></li>
					</ul>
				</div>
				
				<section className="content-header">
					
					<div className="pull-left">
						<h1 style={{margin: '0'}}>{!hasproject ? "Project Not Found" : <span> {project.code ? <span className="label label-primary">{project.code.toUpperCase()}</span> : null } {project.title}</span>}</h1>
						
					</div>
					
					{ hasproject && $api.allowed(['admin']) ? 
						<div className="pull-right box-tools">
							
							{$api.allowed( ['admin'] ) ? 
								<Link to={Config.root + "projects/" + project.id + "/edit/"} className="btn btn-flat btn-sm btn-primary pull-left" style={{marginLeft: '10px'}}><i className="fa fa-pencil"></i> Edit</Link> : null
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
										<Link to={ Config.route + 'projects/' + project.id + '/' }>Details</Link>
									</li>
								</ul>
								<div className="tab-content">
									<div className="tab-pane active" id="details" >
																					
										{/** 
											*	Details Tab 
											*/}
										{project && project.id ? 
											<div className="row " style={{marginLeft: 0, marginRight: 0, margin: '0 5px 40px 0' }}>
												
												{/** PROJECT INFO */}
												<div className="col-md-6" >

													<div className="row">
														<div className="col-xs-4"><b>Project title:</b></div>
														<div className="col-xs-8">{ project.title }</div>
													</div> <hr className="hr-narrow" />

													<div className="row">
														<div className="col-xs-4"><b>Short Code:</b></div>
														<div className="col-xs-8">{ project.code }</div>
													</div> <hr className="hr-narrow" />
														
													<div className="row">
														<div className="col-xs-4"><b>Customer Name:</b></div>
														<div className="col-xs-8">{project.customer_name}</div>
													</div> <hr className="hr-narrow" />
												
												</div>
											</div>
											: null 
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
	
	/**
	 * Before Component Mount
	 */
	componentWillMount() {
		let props = this.props; 
		_api.getSingle( props.params.id );
	
		$api.setPage('projects');
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


const ProjectDetails = connect(mapStateToProps, dispatchToProps)(_ProjectDetails); 
export default ProjectDetails;
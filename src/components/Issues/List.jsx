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
import IssuesTable from './Table.jsx';
import Pagination from '../Commons/Pagination.jsx';
import ModalForm from './ModalForm.jsx';


/**
 * Map Store State to Props
 */
const mapStateToProps = state => { 
	return { 
		session_key: state.appdata.session_key, 
		issues: state.issues.issues,
		filterParams: state.issues.filterParams, 
		filtersDefault: state.issues.filtersDefault,
		filters: state.issues.filters,
		page: state.issues.page,
		sort: state.issues.sort,
	}
};


/**
 * Map Dispatch to Props
 */
const dispatchToProps = dispatch => {
	return {
		setFilters: (filters, component) => dispatch( _store.setFilters(filters, component) ),
		setSort: (sort, component) => dispatch( _store.setSort(sort, component) ),
		setPage: (page, component) => dispatch( _store.setPage(page, component ) ),
	}
}


class _Issues extends React.Component {
	
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
		let {filters, sort, page} = component ? $api.getStore('issues')[component] : $api.getStore('issues');
		_api.getList( filters, true, sort, page, mode );
		
	}
	
	
	/**
	 * Tab Filter
	 */
	tabFilter(tab, component) {
		let props = this.props; 
		let filters = component ? props[component].filters : props.filters;
		
		props.setFilters(filters, component);
		this.getList(component);
		
	}
	
	
	/**
	 * Render Component
	 */
  render() {
		let props = this.props;
		let {filters, sort, page, filterParams} = this.props;
		let issues = this.props.issues; 

		console.log(this.props)
		return (
			<div className="content-wrapper">
				
				<div className="content-top">
					<ul>
						<li><Link to={Config.root} className="" >Home</Link></li>
						<li><Link to={Config.root + "issues/" } className="active" >Issues</Link></li>
					</ul>
				</div>
				
				<section className="content-header">
					<div className="pull-left">
						<h1 style={{margin: '0'}}>
							Issues
						</h1>
					</div>

					<div className="pull-right box-tools">
						<button type="button" onClick={e=>this.props.setModal(ModalForm, {id: 'modal-issue', className: 'modal right fade', getList: this.getList})} className="btn btn-flat btn-sm btn-primary pull-left" style={{marginLeft: '10px'}}><i className="fa fa-pencil"></i> Add</button>
					</div>
					
					<div style={{clear: 'both'}}></div>
				</section>
				
				
				<section className="content">
					<div className="row" style={{margin: '0 0 20px 0'}}>
						<div className="col-sm-2" style={{padding: 0}}>
							<b>Select Project: </b>
						</div>
						<div className="col-sm-4" style={{padding: 0}}>
							<select className="form-control" onChange={(e)=>{ props.setFilters({...filters, project_id: e.target.value}); _api.getList() }}>
								<option value="">-Select Project-</option>
								{filterParams.projects && filterParams.projects.length ? filterParams.projects.map((project,i)=>(
									<option key={i} value={project.id}>{project.title}</option>
								)) : null };
							</select>
						</div>
					</div>
					<div className="row">
					
						<div className="col-md-12">
							<div className="nav-tabs-custom">
								<ul className="nav nav-tabs">
									<li className={!props.route.tab ? 'active' : ''}>
										<Link to={Config.root + 'issues/'} onClick={(e)=>this.tabFilter('')}>All</Link>
									</li>
									<li className="pull-right">
										<Pagination page={props.page} setPage={props.setPage} getList={this.getList} className="hidden-xs" />
									</li>
								</ul>
								<div className="tab-content">
								
									<div className="tab-pane active" id="issues-all" >
									
										<IssuesTable 
											issues={props.issues} 
											filters={props.filters} setFilters={props.setFilters} filterParams={props.filterParams}
											sort={props.sort} setSort={props.setSort} 
											page={props.page} setPage={props.setPage} 
											user={props.user}
											route={props.route}
											getList={this.getList}
											setModal={props.setModal}
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
	
	
	/**
	 * Before Component Mount
	 */
	componentWillMount() {
		let props = this.props;
		$api.setPage('issues');
		
		this.tabFilter( props.route.tab );
		
	}
	
	
	/**
	 * Update New Props
	 */
	componentWillReceiveProps(props) {
		
		// Tab Change
		if( this.props.route.tab != props.route.tab ) {
			this.tabFilter( props.route.tab );
		}
		
	}
	
}




/**
 * Export Component
 */
const Issues = connect(mapStateToProps, dispatchToProps)(_Issues); 
export default Issues;
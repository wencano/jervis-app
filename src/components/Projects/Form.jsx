import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from "react-redux"; 
import _ 				from 'lodash';
import moment 	from 'moment';

import states from '../../vendors/states';

import * as Helpers from '../../helpers';
import * as $api from '../../api';
import * as _api from './api';

import InputDate from '../Commons/Inputs/Date.jsx';
import NotFound from '../../tmpl/404.jsx'; 


/**
 * Map Store State to Props
 */
const mapStateToProps = state => { 
	return { 
		loading: state.appdata.loading,
		user: state.appdata.user, 
		project: state.projects.project, 
		projectDefault: state.projects.projectDefault,
		filterParams: state.projects.filterParams
	}; 
};

class _ProjectForm extends React.Component {
	
	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		
		this.state = {
			project: props.project && props.project.id != 'new' ? props.project : _.cloneDeep( props.projectDefault ),
			updated: null
		}
		
		this.formChange = this.formChange.bind(this);
	}
	
	
	formChange(e) {
    let state = this.state;
    let props = this.props;
    state.project[ e.target.name ] = e.target.value;
    
		if(state.updated == null) state.updated = {};
    state.updated[e.target.name] = e.target.value;
		
		console.log(state.updated)
		console.log(state.project)
		this.setState(state);
	}

	
	/**
	 * Render Component
	 */
  render() {
		
		if( $api.allowed( ['admin'] ) ) {
		
			let _this = this;
			let state = this.state; 
			let props = this.props;
			
			let project = this.state.project;

			let disableBtn = props.loading ? 'disabled' : '';

			return (
				<div className="content-wrapper">
					
					<div className="content-top">
						<ul>
							<li><Link to={Config.root} className="" >Home</Link></li>
							<li><Link to={Config.root + "projects/"} className="" >Projects</Link></li>
							<li><Link to={window.location.href} className="active" >{ project && project.id != 'new' ? 'Edit' : "New" }</Link></li>
						</ul>
					</div>
					
					
					<section className="content-header">
						<div className="pull-left">
							<h1 style={{margin: '0'}}>
								{ project && project.id != 'new' ? project.id : 'Add Project' }
							</h1>
						</div>
						
						<div className="pull-right box-tools">
							
							<button className={ "btn btn-success btn-sm btn-flat " + disableBtn } onClick={(e)=>_api.upsert( state.updated, project, ()=>{_this.setState({...state, updated: null}) } )}>
								<i className="fa fa-cloud-upload"></i> Save
							</button>
							
							{project && project.id != 'new' ? 
								<button className={ "btn btn-danger btn-sm btn-flat " + disableBtn } onClick={(e)=>_api.remove(project.id)}>
									<i className="fa fa-trash"></i> Delete
								</button> 
								: null 
							}
							
							<button className={ "btn btn-default btn-sm btn-flat " + disableBtn } onClick={(e)=>_api.close(state.updated, project)} >Close</button>
						</div>
						
						<div style={{clear: 'both'}}></div>
					</section>
					
					
					<section className="content">
						<div className="row">
							
							<div className="col-sm-6">
								
								<div className="box box-primary">
									<div className="box-header with-border">
										<h3 className="box-title"><i className="fa fa-map-pin"></i> Project Info</h3>
									</div>
									<div className="box-body">
											
										<div className="row">
											<div className="col-xs-4"><b>Customer Name:</b></div>
											<div className="col-xs-8 col-sm-8">
												<input type="text" className="form-control" value={project.customer_name} onChange={this.formChange} name="customer_name" />
											</div>
										</div><hr className="hr-narrow" />

										<div className="row">
											<div className="col-xs-4"><b>Project Title:</b></div>
											<div className="col-xs-8 col-sm-8">
												<input type="text" className="form-control" value={project.title} onChange={this.formChange} name="title" />
											</div>
										</div><hr className="hr-narrow" />

										<div className="row">
											<div className="col-xs-4"><b>Project Code:</b></div>
											<div className="col-xs-8 col-sm-8">
												<input type="text" className="form-control" value={project.code} onChange={this.formChange} name="code" />
											</div>
										</div><hr className="hr-narrow" />

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
		if( $api.allowed( ['admin'] ) ) 
			_api.getSingle( this.props.params.id );
		
		$api.setPage('projects');
	}
	
	
	/**
	 * Update New Props
	 */
	componentWillReceiveProps(props) {
		if(JSON.stringify( this.props.project ) != JSON.stringify( props.project ))
			if( $api.allowed( ['admin'] ) )
				this.setState({project: props.project});
	}
	
}



const ProjectForm = connect(mapStateToProps)(_ProjectForm); 
export default ProjectForm;
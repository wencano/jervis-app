import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'lodash';

import * as Helpers from '../../helpers';
import * as $api from '../../api';

import * as apiProjects from '../Projects/api';
import * as apiUsers from '../Users/api';

import ProjectsTable from '../Projects/Table.jsx';
import NotificationsTable from '../Notifications/Table.jsx';

const DispatcherDashboard = (props) => {
	
	let projects = [];
	for(var i =0;i<5;i++) 
		if( props.projects[i] ) 
			projects.push( props.projects[i] ); 
		
	let notifications = [];
	if( props.notifications && props.notifications.length ) 
		for(var i =0;i<10;i++) 
			if( props.notifications[i] )  
				notifications.push( props.notifications[i] ); 
	
	return (
		<section className="content">
			<div className="row">
				
				<div className="col-md-3 col-sm-6 col-xs-12" onClick={(e)=>Helpers.push( 'projects/' )} style={{cursor: 'pointer'}}>
					<div className="info-box">
						<span className="info-box-icon bg-yellow"><i className="fa fa-book"></i></span>
						<div className="info-box-content">
							<span className="info-box-text">New Projects</span>
							<span className="info-box-number">{props.dashboard.projects.new.addCommas()}</span>
						</div>
					</div>
				</div>
				
				<div className="col-md-3 col-sm-6 col-xs-12" onClick={(e)=>Helpers.push( 'projects/accepted/' )} style={{cursor: 'pointer'}}>
					<div className="info-box">
						<span className="info-box-icon bg-green"><i className="ion ion-android-exit"></i></span>
						<div className="info-box-content">
							<span className="info-box-text">Accepted Projects</span>
							<span className="info-box-number">{props.dashboard.projects.accepted.addCommas()}</span>
						</div>
					</div>
				</div>
				
				<div className="col-md-3 col-sm-6 col-xs-12" onClick={(e)=>Helpers.push( 'projects/dispatched/' )} style={{cursor: 'pointer'}}>
					<div className="info-box">
						<span className="info-box-icon bg-aqua"><i className="ion ion-android-checkbox-outline"></i></span>
						<div className="info-box-content">
							<span className="info-box-text">Dispatched Projects</span>
							<span className="info-box-number">{props.dashboard.projects.dispatched.addCommas()}</span>
						</div>
					</div>
				</div>
				
				<div className="col-md-3 col-sm-6 col-xs-12" onClick={(e)=>Helpers.push( 'locations/' )} style={{cursor: 'pointer'}} >
					<div className="info-box">
						<span className="info-box-icon bg-red"><i className="ion ion-ios-people-outline"></i></span>
						<div className="info-box-content">
							<span className="info-box-text">Technicians</span>
							<span className="info-box-number">{props.dashboard.locations} <small style={{fontWeight: 'normal'}}>Cities</small></span>
							<span className="info-box-number">{props.dashboard.technicians} <small style={{fontWeight: 'normal'}}>Technicians</small></span>
						</div>
					</div>
				</div>
			</div>
			
			
			<div className="row">
			
				<div className="col-sm-5 col-xs-12 pull-right">
					
					<div className="nav-tabs-custom" >
						<ul className="nav nav-tabs pull-right ui-sortable-handle">
							<li className="hidden-xs"><a href="#projects-table" data-toggle="tab" onClick={(e)=>getProjects(3, props.projectDefaultFilters)}>Dispatched</a></li>
							<li><a href="#projects-table" data-toggle="tab" onClick={(e)=>getProjects(2, props.projectDefaultFilters) }>Accepted</a></li>
							<li className="active"><a href="#projects-table" data-toggle="tab" onClick={(e)=>getProjects(1, props.projectDefaultFilters) }>New</a></li>
							
							<li className="pull-left header"><i className="fa fa-book"></i> Projects</li>
						</ul>
						<div className="tab-content ">
							<div className="tab-pane active" id="projects-table">
								
								{ projects && projects.length ? projects.map((project, i) => (
										<div className="row table-row table-body-row " key={i} onClick={()=>Helpers.push( 'projects/' + project.id + "/") } style={{cursor: 'pointer', position: 'relative'}}>
											<div className="visible-xs">
												<div style={{textAlign: 'center', fontSize: '16px', border: '2px solid #000', fontWeight: 'bold', float: 'left', width: '65px', height: '50px', lineHeight: '40px', marginBottom: '0', color: '#000', display: 'table', overflow: 'hidden' }}>
													<div style={{display: 'table-cell', verticalAlign: 'middle', lineHeight: '1em', overflow: 'hidden'}}>{project.job_id}</div>
												</div>
											</div>
											<div className="col-xs-8 ">
												<Link to={Config.root + 'projects/' + project.id + '/'}><b>{project.title}</b></Link><br />
												<span style={{color: '#999'}}>
													{ project.location_name != '' ? project.location_name : statusText(project.status) } &bull; {
														project.tech_name && project.tech_name != '' ? project.tech_name : firstSched( project.schedules )
													}
												</span>
											</div>
											<Link to={Config.root + 'projects/' + project.id + '/'} title="Open" style={{position: 'absolute', top: '50%', right: 15, marginTop: '-10px' }}>
												<i className="fa  fa-chevron-right"></i>
											</Link>
										</div>
									)) : <p>No projects found.</p>
								}
								
							</div>
						</div>
						<div className="box-footer text-center">
              <Link to={Config.root +'projects/'} className="uppercase">View All</Link>
            </div>
					</div>
				</div>
				
				<div className="pull-left col-sm-7">
					<h4>Latest Updates</h4>
					
					<NotificationsTable view="dashboard" />
				
				</div>
				
				
				
			
			</div>
			
		</section>
	)
}

export default DispatcherDashboard

let statusText = (status) => {
	switch(status) {
		case "1": return "NEW";
		case "2": return "ACCEPTED";
		case "3": return "COMPLETED";
		default: return "DRAFT"; 
	}
}

let firstSched = scheds => {
	let time = [];
	
	if( scheds && scheds.length ) {
		if( scheds[0].t9_12pm != '' ) time.push('9-12pm');
		if( scheds[0].t12_3pm != '' ) time.push('12-3pm');
		if( scheds[0].t3_6pm != '' ) time.push('3-6pm');
		if( scheds[0].t6_9pm != '' ) time.push('6-9pm');
		
		return "starts on " + moment( scheds[0].date ).format("MMM D") + " " + time.join(", ");
	}
}




let getProjects = (status, filters) => {
	apiProjects.setFilters({...filters, status: status });
	apiProjects.getList();
}
import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'lodash';

import * as Helpers from '../../helpers';
import * as $api from '../../api';
import * as apiProjects from '../Projects/api';
import * as apiUsers from '../Users/api';

import ProjectsTable from '../Projects/Table.jsx';

const TechnicianDashboard = (parent_props) => {
	
	let props = parent_props.props; 
	
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
				
				<div className="col-md-4 col-sm-6 col-xs-12" onClick={(e)=>Helpers.push( 'projects/' )} style={{cursor: 'pointer'}}>
					<div className="info-box">
						<span className="info-box-icon bg-yellow"><i className="fa fa-book"></i></span>
						<div className="info-box-content">
							<span className="info-box-text">New Projects</span>
							<span className="info-box-number">{props.counters.new.addCommas()}</span>
						</div>
					</div>
				</div>
				
				<div className="col-md-4 col-sm-6 col-xs-12" onClick={(e)=>Helpers.push( 'projects/accepted/' )} style={{cursor: 'pointer'}}>
					<div className="info-box">
						<span className="info-box-icon bg-green"><i className="ion ion-android-exit"></i></span>
						<div className="info-box-content">
							<span className="info-box-text">Accepted Projects</span>
							<span className="info-box-number">{props.counters.accepted.addCommas()}</span>
						</div>
					</div>
				</div>
				
				<div className="col-md-4 col-sm-6 col-xs-12" onClick={(e)=>Helpers.push( 'projects/dispatched/' )} style={{cursor: 'pointer'}}>
					<div className="info-box">
						<span className="info-box-icon bg-aqua"><i className="ion ion-android-checkbox-outline"></i></span>
						<div className="info-box-content">
							<span className="info-box-text">Dispatched Projects</span>
							<span className="info-box-number">{props.counters.dispatched.addCommas()}</span>
						</div>
					</div>
				</div>
				
				
			</div>
			
			
			<div className="row">
			
				<div className="col-sm-5 col-xs-12 pull-right">
					
					<div className="nav-tabs-custom" style={{cursor: 'move'}} >
						<ul className="nav nav-tabs pull-right ui-sortable-handle">
							<li className="hidden-xs"><a href="#projects-table" data-toggle="tab" onClick={(e)=> apiProjects.getList({...props.projectFilters, status: 3})}>Dispatched</a></li>
							<li><a href="#projects-table" data-toggle="tab" onClick={(e)=> apiProjects.getList({...props.projectFilters, status: 2})}>Accepted</a></li>
							<li className="active"><a href="#projects-table" data-toggle="tab" onClick={(e)=> apiProjects.getList({...props.projectFilters, status: 1})}>New</a></li>
							
							<li className="pull-left header"><i className="fa fa-book"></i> Projects</li>
						</ul>
						<div className="tab-content ">
							<div className="tab-pane active" id="projects-table">
								
								{ projects && projects.length ? projects.map((project, i) => (
										<div className="row table-row table-body-row " key={i} onClick={()=>Helpers.push( 'projects/' + project.id + "/") } style={{cursor: 'pointer', position: 'relative'}}>
											<div style={{textAlign: 'center', fontSize: '16px', border: '2px solid #000', fontWeight: 'bold', float: 'left', width: '65px', height: '50px', lineHeight: '40px', marginBottom: '0', color: '#000' }}>
												{project.id}
											</div>
											<div className="col-xs-8 ">
												<Link to={Config.root + 'projects/' + project.id + '/'}><b>{project.title}</b></Link><br />
												<span style={{color: '#999'}}>
													{ project.location_name != '' ? project.location_name : statusText(project.status) } &bull; {
														project.tech_name != '' ? project.tech_name : firstSched( project.schedules )
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
					
					<table className="table">
						<tbody>
							{ notifications && notifications.length ? notifications.map( (log,i) => (
									<tr key={i}>
										<td>
											<span>{log.type == 'settings' ? <i className="fa fa-gear text-red"></i> : null }
											{log.type == 'project' ? <i className="fa fa-book text-green"></i> : null }
											{log.type == 'user' ? <i className="fa fa-user text-aqua"></i> : null }
											</span> {log.message}  <br/><span style={{color: '#aaa'}}>
												<small><i className="fa fa-clock-o"></i> {moment(log.date_created).format("MMM D, YYYY, h:mm a")}</small>
											</span>
										</td>
									</tr>
								)) : null 
							}
							<tr>
								<td><Link to={Config.root + "notifications/"}>See All</Link></td>
							</tr>
						</tbody>
					</table>
				
				</div>
				
				
				
			
			</div>
			
		</section>
	)
}

export default TechnicianDashboard

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
		if( scheds[0].am != '' ) time.push('AM');
		if( scheds[0].pm != '' ) time.push('PM');
		if( scheds[0].eve != '' ) time.push('EVE');
		
		return "starts on " + moment( scheds[0].date ).format("MMM D") + " " + time.join("|");
	}
}
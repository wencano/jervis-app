import React, {Component, PropTypes} 		from 'react';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';

import * as Helpers from '../../helpers';
import * as $api from '../../api';
import * as _api from './api';

import NotFound from '../../tmpl/404.jsx'; 

const mapStateToProps = (state) => {
	return {appdata: state.appdata, settings: state.settings.settings }
}

class _SettingForm extends Component {
	
	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		
		this.state = {
			settings: _.cloneDeep( props.settings ),
			settingsUpdated: null
		}
		
		this.formChange = this.formChange.bind(this);
		
	}
	
	
	formChange(e) {
		let state = this.state;
		state.settings[ e.target.name ] = e.target.value;
		
		if(state.settingsUpdated == null) state.settingsUpdated = {};
		state.settingsUpdated[e.target.name] = e.target.value;
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
			let settings = this.state.settings; 
			
			return (
				<div className="content-wrapper">
					
					<div className="content-top">
						<ul>
							<li><Link to={Config.root} className="" >Home</Link></li>
							<li><Link to={Config.root + "settings/" } className="" >Settings</Link></li>
							<li><Link to={Config.root + "settings/edit/" } className="active" >Modify</Link></li>
						</ul>
					</div>
					
					<section className="content-header">
						
						<div className="pull-left">
							<h1 style={{margin: '0'}}>Modify Settings</h1>
						</div>
						
						<div className="pull-right box-tools">
							<button className="btn btn-success btn-sm" onClick={(e)=>_api.set( state.settingsUpdated, ()=>{_this.setState({...state, settingsUpdated: null}) } )}><i className="fa fa-cloud-upload"></i> Save</button>&nbsp;
							<button className="btn btn-default btn-sm" onClick={(e)=>{ if( (state.settingsUpdated && confirm('There are unsaved changes. Are you sure you want to close this form?')) || !state.settingsUpdated ) Helpers.push( "settings/" ); }}>Close</button>
						</div>
						
						<div style={{clear: 'both'}}></div>
					</section>
					
					
					<section className="content">
						<div className="row">
							<div className="col-sm-7">
								
								{/** Company Info */}
								<div className="box box-primary">
									<div className="box-header with-border">
										<h3 className="box-title"><i className="fa fa-building"></i> Company Info</h3>
										<div className="box-tools pull-right">
											<button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
										</div>
									</div>
									<div className="box-body">
										<div className="row ">
											<div className="col-xs-4"><b>Name:</b></div>
											<div className="col-xs-8"><input type="text" className="form-control" value={settings.company_name} onChange={this.formChange} name="company_name" /></div>
										</div><hr className="hr-narrow"></hr>
										<div className="row ">
											<div className="col-xs-4"><b>Phone:</b></div>
											<div className="col-xs-8"><input type="text" className="form-control" value={settings.company_phone} onChange={this.formChange} name="company_phone" /></div>
										</div><hr className="hr-narrow"></hr>
										<div className="row ">
											<div className="col-xs-4"><b>Email:</b></div>
											<div className="col-xs-8"><input type="text" className="form-control" value={settings.company_email} onChange={this.formChange} name="company_email" /></div>
										</div><hr className="hr-narrow"></hr>
										<div className="row ">
											<div className="col-xs-4"><b>Address:</b></div>
											<div className="col-xs-8">
												<textarea className="form-control" value={settings.company_address} onChange={this.formChange} name="company_address" rows={4}/>
											</div>
										</div><hr className="hr-narrow"></hr>
										<div className="row ">
											<div className="col-xs-4"><b>City:</b></div>
											<div className="col-xs-8"><input type="text" className="form-control" value={settings.company_city} onChange={this.formChange} name="company_city" /></div>
										</div><hr className="hr-narrow"></hr>
										<div className="row ">
											<div className="col-xs-4"><b>State:</b></div>
											<div className="col-xs-8"><input type="text" className="form-control" value={settings.company_state} onChange={this.formChange} name="company_state" /></div>
										</div>
										<div className="row ">
											<div className="col-xs-4"><b>ZIP:</b></div>
											<div className="col-xs-8"><input type="text" className="form-control" value={settings.company_zip} onChange={this.formChange} name="company_zip" /></div>
										</div>
									</div>
								</div>
								
								
								{/** Message to Technicians */}
								<div className="box box-primary">
									<div className="box-header with-border">
										<h3 className="box-title"><i className="fa fa-gear"></i> General Settings</h3>
										<div className="box-tools pull-right">
											<button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
										</div>
									</div>
									<div className="box-body">
										<div className="row ">
											<div className="col-xs-12"><b>Note to Technicians:</b></div>
											<div className="col-xs-12">
												<textarea className="form-control" value={settings.note_to_technician} onChange={this.formChange} name="note_to_technician" rows={8}/>
											</div>
										</div><hr className="hr-narrow"></hr>
										<div className="row ">
											<div className="col-xs-12"><b>Note to Dispatchers:</b></div>
											<div className="col-xs-12">
												<textarea className="form-control" value={settings.note_to_dispatcher} onChange={this.formChange} name="note_to_dispatcher" rows={8}/>
											</div>
										</div>
									</div>
								</div>
								
								{/** SMTP Credentials */}
								<div className="box box-primary">
									<div className="box-header with-border">
										<h3 className="box-title"><i className="fa fa-envelope"></i> SMTP Mailer Credentials</h3>
									</div>
									<div className="box-body">
										<div className="row ">
											<div className="col-xs-4"><b>Enabled:</b></div>
											<div className="col-xs-4">
												<select className="form-control" value={settings.smtp_enabled} onChange={(e)=>this.formChange(e)} name="smtp_enabled" >
													<option value="1">Yes</option>
													<option value="0">No</option>
												</select>
											</div>
										</div>
										{ settings.smtp_enabled == 1 ? 
											<div>
												<hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>Host:</b></div>
													<div className="col-xs-8">
														<input type="text" className="form-control" value={settings.smtp_host} onChange={(e)=>this.formChange(e)} name="smtp_host" />
													</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>Port:</b></div>
													<div className="col-xs-4">
														<input type="text" className="form-control" value={settings.smtp_port} onChange={(e)=>this.formChange(e)} name="smtp_port" />
													</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>Security:</b></div>
													<div className="col-xs-8">
														<select className="form-control" value={settings.smtp_security} onChange={(e)=>this.formChange(e)} name="smtp_security" >
															<option value="SSL">TLS/SSL</option>
															<option value="">None</option>
														</select>
													</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>User:</b></div>
													<div className="col-xs-8">
														<input type="text" className="form-control" value={settings.smtp_user} onChange={(e)=>this.formChange(e)} name="smtp_user" />
													</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>Password:</b></div>
													<div className="col-xs-8">
														<input type="password" className="form-control" value={settings.smtp_pass} onChange={(e)=>this.formChange(e)} name="smtp_pass" />
													</div>
												</div>
											</div> : null
										}
										
									</div>
								</div>
								
								
								{/** Slack API Credentials */}
								{/** 
								<div className="box box-primary">
									<div className="box-header with-border">
										<h3 className="box-title"><i className="fa fa-slack"></i> Slack API Credentials</h3>
									</div>
									<div className="box-body">
										<div className="row ">
											<div className="col-xs-4"><b>Enabled:</b></div>
											<div className="col-xs-4">
												<select className="form-control" value={settings.slack_enabled} onChange={(e)=>this.formChange(e)} name="slack_enabled" >
													<option value="1">Yes</option>
													<option value="0">No</option>
												</select>
											</div>
										</div>
										
										{ settings.slack_enabled == 1 ? 
											<div>
												<hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>API Endpoint:</b></div>
													<div className="col-xs-8">
														<input type="text" className="form-control" value={settings.slack_api} onChange={(e)=>this.formChange(e)} name="slack_api" />
													</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>API Key:</b></div>
													<div className="col-xs-8">
														<input type="text" className="form-control" value={settings.slack_api_key} onChange={(e)=>this.formChange(e)} name="slack_api_key" />
													</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>API User:</b></div>
													<div className="col-xs-8">
														<input type="text" className="form-control" value={settings.slack_api_user} onChange={(e)=>this.formChange(e)} name="slack_api_user" />
													</div>
												</div>
											</div> : null
										}
										
									</div>
								</div> */}
								
								
								{/** Twilio API Credentials */}
								<div className="box box-primary">
									<div className="box-header with-border">
										<h3 className="box-title"><i className="fa fa-mobile-phone"></i> Twilio API Credentials</h3>
									</div>
									<div className="box-body">
										<div className="row ">
											<div className="col-xs-4"><b>Enabled:</b></div>
											<div className="col-xs-8">
												<select className="form-control" value={settings.twilio_enabled} onChange={(e)=>this.formChange(e)} name="twilio_enabled" >
													<option value="1">Yes</option>
													<option value="0">No</option>
												</select>
											</div>
										</div>
										
										{ settings.twilio_enabled == 1 ? 
											<div>
												<hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>API Endpoint:</b></div>
													<div className="col-xs-8">
														<input type="text" className="form-control" value={settings.twilio_api} onChange={(e)=>this.formChange(e)} name="twilio_api" />
													</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>API Account SID:</b></div>
													<div className="col-xs-8">
														<input type="text" className="form-control" value={settings.twilio_api_sid} onChange={(e)=>this.formChange(e)} name="twilio_api_sid" />
													</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>API Auth Token:</b></div>
													<div className="col-xs-8">
														<input type="text" className="form-control" value={settings.twilio_api_authtoken} onChange={(e)=>this.formChange(e)} name="twilio_api_authtoken" />
													</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>SMS Phone Number:</b></div>
													<div className="col-xs-8">
														<input type="text" className="form-control" value={settings.twilio_api_from} onChange={(e)=>this.formChange(e)} name="twilio_api_from" />
													</div>
												</div>
												
											</div> : null
										}
										
									</div>
								</div>
								
							</div>
							
						</div>
					</section>
					
				</div>
			);
			
		}
		
		else return <NotFound />;
		
	}
	
	
	/**
	 * Before Component Mount
	 */
	componentWillMount() {
		_api.get();
		$api.setPage('settings');
	}
	
	
	/**
	 * Update New Props
	 */
	componentWillReceiveProps(props) {
		if( JSON.stringify(this.props.settings) !== JSON.stringify(props.settings)) this.setState({settings: _.cloneDeep( props.settings ) });
	}
	
}

const SettingForm = connect(mapStateToProps)(_SettingForm); 
export default SettingForm;
import React, {Component, PropTypes} 		from 'react';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';
import nl2br from 'react-nl2br';

import * as $api from '../../api';
import * as _api from './api';

import NotFound from '../../tmpl/404.jsx';

const mapStateToProps = (state) => {
	return {appdata: state.appdata, settings: state.settings.settings }
}

class _Settings extends Component {
	
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
		
		if( $api.allowed( ['admin'] ) ) {
			
			let state = this.state; 
			let props = this.props;
			let settings = this.props.settings; 
			
			return (
				<div className="content-wrapper">
					
					<div className="content-top">
						<ul>
							<li><Link to={Config.root} className="" >Home</Link></li>
							<li><Link to={Config.root + "settings/" } className="active" >Settings</Link></li>
						</ul>
					</div>
					
					<section className="content-header">
						
						<div className="pull-left">
							<h1 style={{margin: '0'}}>Settings</h1>
						</div>
						
						<div className="pull-right box-tools">
							<Link to={Config.root + "settings/edit/"} className="btn btn-primary btn-sm">
								<i className="fa fa-pencil"></i> Edit
							</Link>
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
											<div className="col-xs-8">{settings.company_name}</div>
										</div><hr className="hr-narrow"></hr>
										<div className="row ">
											<div className="col-xs-4"><b>Phone:</b></div>
											<div className="col-xs-8">{settings.company_phone}</div>
										</div><hr className="hr-narrow"></hr>
										<div className="row ">
											<div className="col-xs-4"><b>Email:</b></div>
											<div className="col-xs-8">{settings.company_email}</div>
										</div><hr className="hr-narrow"></hr>
										<div className="row ">
											<div className="col-xs-4"><b>Address:</b></div>
											<div className="col-xs-8">{settings.company_address}</div>
										</div><hr className="hr-narrow"></hr>
										<div className="row ">
											<div className="col-xs-4"><b>City:</b></div>
											<div className="col-xs-8">{settings.company_city}</div>
										</div><hr className="hr-narrow"></hr>
										<div className="row ">
											<div className="col-xs-4"><b>State:</b></div>
											<div className="col-xs-8">{settings.company_state}</div>
										</div><hr className="hr-narrow"></hr>
										<div className="row ">
											<div className="col-xs-4"><b>ZIP:</b></div>
											<div className="col-xs-8">{settings.company_zip}</div>
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
											<div className="col-xs-12">{nl2br( settings.note_to_technician)}</div>
										</div><hr className="hr-narrow"></hr>
										<div className="row ">
											<div className="col-xs-12"><b>Note to Dispatchers:</b></div>
											<div className="col-xs-12">{nl2br( settings.note_to_dispatcher )}</div>
										</div>
									</div>
								</div>
							
								{/** SMTP Credentials */}
								<div className="box box-primary">
									<div className="box-header with-border">
										<h3 className="box-title"><i className="fa fa-envelope"></i> SMTP Mailer Credentials</h3>
										<div className="box-tools pull-right">
											<button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
										</div>
									</div>
									<div className="box-body">
										<div className="row ">
											<div className="col-xs-4"><b>Enabled:</b></div>
											<div className="col-xs-8">{settings.smtp_enabled == 1 ? 'Yes' : 'No' }</div>
										</div>
										{ settings.smtp_enabled == 1 ? 
											<div>
												<hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>Host:</b></div>
													<div className="col-xs-8">{settings.smtp_host}</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>Port:</b></div>
													<div className="col-xs-8">{settings.smtp_port}</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>Security:</b></div>
													<div className="col-xs-8">{settings.smtp_security}</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>User:</b></div>
													<div className="col-xs-8">{settings.smtp_user}</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>Password:</b></div>
													<div className="col-xs-8">*****</div>
												</div>
											</div> : 
											
											<div>
												<br />
												<p><i> Note: The app will attempt to use phpmailer and sendmail libraries for email notifications. However, emails may be put in spam folders since the mail server is not a known email service provider.</i> </p>
											</div>
										}									
									</div>
								</div>
								
								
								{/** Slack API Credentials */}
								{/** 
								<div className="box box-primary">
									<div className="box-header with-border">
										<h3 className="box-title"><i className="fa fa-slack"></i> Slack API Credentials</h3>
										<div className="box-tools pull-right">
											<button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
										</div>
									</div>
									<div className="box-body">
										<div className="row ">
											<div className="col-xs-4"><b>Enabled:</b></div>
											<div className="col-xs-8">{settings.slack_enabled == 1 ? 'Yes' : 'No'}</div>
										</div>
										{ settings.slack_enabled == 1 ? 
											<div>
												<hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>API Endpoint:</b></div>
													<div className="col-xs-8">{settings.slack_api}</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>API Key:</b></div>
													<div className="col-xs-8">{settings.slack_api_key}</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>API User:</b></div>
													<div className="col-xs-8">{settings.slack_api_user}</div>
												</div>
											</div> : null 
										}
									</div>
								</div>*/}
								
								
								{/** Twilio API Credentials */}
								<div className="box box-primary">
									<div className="box-header with-border">
										<h3 className="box-title"><i className="fa fa-mobile-phone"></i> Twilio API Credentials</h3>
										<div className="box-tools pull-right">
											<button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
										</div>
									</div>
									<div className="box-body">
										<div className="row ">
											<div className="col-xs-4"><b>Enabled:</b></div>
											<div className="col-xs-8">{settings.twilio_enabled == 1 ? 'Yes' : 'No'}</div>
										</div>
										{settings.twilio_enabled == 1 ? 
											<div>
												<hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>API Endpoint:</b></div>
													<div className="col-xs-8">{settings.twilio_api}</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>API Account SID:</b></div>
													<div className="col-xs-8">{settings.twilio_api_sid}</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>API Auth Token:</b></div>
													<div className="col-xs-8">{settings.twilio_api_authtoken}</div>
												</div><hr className="hr-narrow" />
												<div className="row">
													<div className="col-xs-4"><b>SMS Phone Number:</b></div>
													<div className="col-xs-8">{settings.twilio_api_from}</div>
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
		if( $api.allowed( ['admin', 'dispatcher'] ) ) _api.get();
		$api.setPage('settings');
	}
	
	
	/**
	 * Component Did Mount
	 */
	componentDidMount() {
		$(function(){
			$.AdminLTE.layout.fix();
			$('.anim').addClass('anim-go');
		});
	}
	
	
	/**
	 * Update New Props
	 */
	componentWillReceiveProps(nextProps) {
		
	}
	
}

const Settings = connect(mapStateToProps)(_Settings); 
export default Settings;
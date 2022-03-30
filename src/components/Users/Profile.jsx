/**
 * Profile
 *
 * Edit user profile
 */
import React 		from 'react';
import ReactDOM	from 'react-dom';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';


// Component Imports
import * as _store from './store';
import * as _api from './api';
import * as $api from '../../api';
import * as Helpers from '../../helpers';
import tz from '../../vendors/tz';
import Availability from './Availability.jsx';


/**
 * Map Store State to Props
 */
const mapStateToProps = state => { 
	return { user: state.users.user, userDefault: state.users.userDefault }; 
}; 


/**
 * Default Component
 */
class _Profile extends React.Component {
	
	
	/**
	 * Constructor
	 */
	constructor(props) {
		
		super(props);
		
		this.state = {
			search: '',
			user: this.props.user || _.cloneDeep( this.props.userDefault )
		}
		
		this.formChange 		= this.formChange.bind(this);
		this.updateProfile 	= this.updateProfile.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
	}
	
	
	/**
	 * Form Change
	 */
	formChange(e) {
		let state = this.state;
		let v = e.target.value;
		
		state.user[ e.target.name ] = v; 
		
		this.setState( state );
	}
	
	
	/**
	 * Update Profile
	 */
	updateProfile(e) {
		if(e) {
			e.preventDefault();
			e.stopPropagation();
		}
		
		let update = {
			id : 				this.state.user.id,
			name_first: ReactDOM.findDOMNode(this.refs.name_first).value.trim(),
			name_last: 	ReactDOM.findDOMNode(this.refs.name_last).value.trim(),
			email: 			ReactDOM.findDOMNode(this.refs.email).value.trim(),
			//timezone: 	ReactDOM.findDOMNode(this.refs.timezone).value.trim(),
		}
		
		// Update User
		_api.updateUser( "profile", update );
		
	}
	
	
	
	/**
	 * Update Password
	 */
	updatePassword(e) {
		if(e) {
			e.preventDefault();
			e.stopPropagation();
		}
		
		let update = {
			id : 				this.state.user.id,
			password : 	ReactDOM.findDOMNode(this.refs.password).value.trim(),
			password_confirm : 	ReactDOM.findDOMNode(this.refs.password_confirm).value.trim(),
		}
		
		// Validate
		if( update.id == '' || update.id == null || update.password == '' || update.password !== update.password_confirm ) 
			alert("ERROR: Invalid new password.");
		
		// Update User
		else {
			_api.updateUser( "password", update );
			ReactDOM.findDOMNode(this.refs.password).value = '';
			ReactDOM.findDOMNode(this.refs.password_confirm).value = '';
		}
		
	}

	
	/**
	 * Render
	 */
	render() {
		
		let props = this.props; 
		let state = this.state; 
		let user = this.state.user;

		return (
			<div className="content-wrapper">
			
				{/** FEATURE_TECHNICIAN: Add Container for full-width */}
				<div className={ $api.is('technician') ? 'container' : '' }>
				
				
				{ $api.allowed([ 'admin', 'dispatcher']) ? 
					<div className="content-top">
						<ul>
							<li><Link to={Config.root} className="" >Home</Link></li>
							<li><Link to={Config.root + "profile/"} className="active" >Profile</Link></li>
						</ul>
					</div>
					: null
				}
				
				<section className="content-header">
					<h1>{user.name_first + " " + user.name_last }</h1>
				</section>
				
				{/* Main content */}
				<section className="content">	
					<div className="row">
						
						<div className="col-md-6">
							<div className="nav-tabs-custom">
								<ul className="nav nav-tabs">
									<li className={props.route.tab == '' ? 'active' : '' }>
										<Link to={Config.root + 'profile/'} >Profile</Link>
									</li>
									<li className={props.route.tab == 'availability' ? 'active' : '' }>
										<Link to={Config.root + 'profile/availability/'} >Availability</Link>
									</li>
									<li className={props.route.tab == 'password' ? 'active' : '' }>
										<Link to={Config.root + 'profile/password/'} >Password</Link>
									</li>
									<li className={props.route.tab == 'work-info' ? 'active' : '' }>
										<Link to={Config.root + 'profile/work-info/'} >Work Info</Link>
									</li>
									
								</ul>
								<div className="tab-content">
								

									{/** 
										* Tab: Profile 
										*/}
									{ !props.route.tab ? 
										<div className={ "tab-pane active "}  id="profile">
											<form className="form-horizontal">
												
												{/** Profile Photo
												<div className="form-group">
													<label htmlFor="inputProfilePhoto" className="col-sm-2 control-label">Profile Photo</label>

													<div className="col-sm-10">
														
														<div className="input-profile-photo">
															<img className="profile-user-img img-responsive img-circle" src={Config.assets + "dist/img/user2-160x160.jpg"} alt="User profile picture" />
														</div>
														
														<input type="file" className="form-control" id="inputProfilePhoto" placeholder="Profile Photo" ref="photo" style={{visibility: 'hidden'}}/>
														
													</div>
												</div> */}
												
												<div className="form-group">
													<label htmlFor="inputNameFirst" className="col-sm-3 control-label">First Name</label>

													<div className="col-sm-9">
														<input type="text" className="form-control" id="inputNameFirst" placeholder="First Name" ref="name_first" value={user.name_first} onChange={(e)=>this.formChange(e)} name="name_first" />
													</div>
												</div>
												
												<div className="form-group">
													<label htmlFor="inputNameLast" className="col-sm-3 control-label">Last Name</label>

													<div className="col-sm-9">
														<input type="text" className="form-control" id="inputNameLast" placeholder="Last Name" ref="name_last" value={user.name_last} onChange={(e)=>this.formChange(e)} name="name_last"  />
													</div>
												</div>
												
												<div className="form-group">
													<label htmlFor="inputEmail" className="col-sm-3 control-label">Email</label>

													<div className="col-sm-9">
														<input type="text" className="form-control" id="inputEmail" placeholder="Email" ref="email" value={user.email} onChange={(e)=>this.formChange(e)} name="email" />
													</div>
												</div>
												
												{/** 
												<div className="form-group">
													<label htmlFor="inputTimezone" className="col-sm-2 control-label">Timezone</label>

													<div className="col-sm-6">
														<select className="form-control" id="inputTimeZone" ref="timezone" defaultValue={user.timezone}  >
															{tz.map( (tzi, i) => (
																<optgroup key={i} label={tzi.text}>
																	{tzi.utc && tzi.utc.length > 0 ? tzi.utc.map( (tzutc,j) => (
																			<option key={j} value={tzutc} >{tzutc}</option>
																		)) : 
																		<option value={tzi.text} >{tzi.text}</option>
																	}
																</optgroup>
															))}
														</select>
													</div>
												</div> */}
												
												<div className="form-group">
													<div className="col-sm-offset-3 col-sm-9">
														<button type="submit" className="btn btn-danger" onClick={this.updateProfile} >Update</button>
													</div>
												</div>
											</form>
										</div>
										: null
									}

									
									{/** 
										* Tab: Password 
										*/}
									{props.route.tab == 'password'  ?
										<div className="tab-pane active" id="password">
											<p>Change your password here.</p>
											<form className="form-horizontal" id="password-form">
												<div className="form-group">
													<label htmlFor="inputPassword" className="col-sm-3 control-label">New Password</label>
													<div className="col-sm-9">
														<input type="password" className="form-control" id="inputPassword" placeholder="Enter New Password" ref="password" />
													</div>
												</div>
												<div className="form-group">
													<label htmlFor="inputPasswordConfirm" className="col-sm-3 control-label">Confirm Password</label>
													<div className="col-sm-9">
														<input type="password" className="form-control" id="inputPasswordConfirm" placeholder="Confirm New Password" ref="password_confirm" />
													</div>
												</div>
												<div className="form-group">
													<div className="col-sm-offset-3 col-sm-9">
														<button type="submit" className="btn btn-danger" onClick={this.updatePassword} >Update</button>
													</div>
												</div>
											</form>
										</div>
										: null
									}

									{/* /.tab-pane */}
									
									
									{/** 
										* Tab: Work Info Tab 
										*/}
									{props.route.tab == 'work-info' ? 
									
										<div className="tab-pane active" id="work-info">
											
											{/**
												* User: Technician
												*/}
											{user.type == 'technician' ? 
												<div>
													

													<div className="row">
														<div className="col-xs-4"><b>Starting Rate: </b></div>
														<div className="col-xs-8">
															${ ( user.hourly_rate_start || 0 ).toFloat().accounting() }
														</div>
													</div><hr className="hr-narrow" />

													<div className="row">
														<div className="col-xs-4"><b>Current Rate: </b></div>
														<div className="col-xs-8">
															${ ( user.hourly_rate || 0 ).toFloat().accounting() }&nbsp;
															{user.last_raise_date != '0000-00-00 00:00:00' ? "(since " + Helpers.tz( user.last_raise_date ).format("MMM D, YYYY") + ")" : null }
														</div>
													</div><hr className="hr-narrow" />

													<div className="row">
														<div className="col-xs-12"><b>Projects: </b></div>
														<div className="col-xs-12">
															<ul>
																<li>{user.num_accepted} Accepted</li>
																<li>{user.num_dispatched} Dispatched</li>
																<li>{user.num_completed} Completed</li>
															</ul>
														</div>
													</div><hr className="hr-narrow" />

													<div className="row">
														<div className="col-xs-12"><b>Categories: </b></div>
														<div className="col-xs-12">
															{ user.categories && user.categories.length ? user.categories.map( (cat, i) => (
																<a key={i} to="javascript:;" className="label label-primary label-sm" style={{ float: 'left', margin: '0 7px 7px 0', fontSize: 13, fontWeight: 'normal'}}>{cat.name}</a> ) ) 
																: "No categories found." 
															}
														</div>
													</div><hr className="hr-narrow" />
													
													<div className="row">
														<div className="col-xs-12"><b>Locations: </b></div>
														<div className="col-xs-12">
															<ul>
																{ user.locations && user.locations.length ? user.locations.map( (loc, i) => {

																	// Tech Address
																	let loc_address = Helpers.formatAddressWithStreet( loc.address_street, loc.address_city, loc.address_zip, loc.state );
																	let verify_link = "https://www.google.com/maps/search/?api=1&query=" + loc_address;

																		return ( 
																			<li key={i}>
																				{loc.location_name} ({ loc.num_projects} projects)<br />
																				Address: { loc_address.length ? <a href={verify_link} target="_blank">{loc_address}</a> : <span className="text-red">NO ADDRESS</span> }
																			</li> 
																		); 
																	}) 
																	: "No locations found." 
																}
															</ul>
														</div>
													</div><hr className="hr-narrow" />

													
													
													
												</div> : null
											}
											
										
										</div>
										: null
										}
									
									{/** 
										* Tab: Availability 
										*/}
									{ props.route.tab == 'availability' ? 
										<Availability user_id={user.id} user={user} />
										: null
									}
									
								</div>
								{/* /.tab-content */}
							</div>
							{/* /.nav-tabs-custom */}
						</div>
						{/* /.col */}
					</div>
					{/* /.row */}

				</section>
				{/* /.content */}
				
				
				</div>

			</div>
		);
	}
	
	
	/**
	 * Component Will Mount
	 */
	componentWillMount() {
		let _this = this;
		$api.setPage( 'users' );
		
		_api.getUserDetails();
	}
	
	
	/**
	 * Component Will Receive New Props
	 */
	componentWillReceiveProps(props) {
		if( JSON.stringify( this.props ) != JSON.stringify( props ) ) {
			this.state.user = props.user;
			this.setState( this.state );
		}
	}
	
	
}; 



/**
 * Export Component
 */
const Profile = connect(mapStateToProps)(_Profile); 
export default Profile;
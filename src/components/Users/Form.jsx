import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from "react-redux"; 
import _ 				from 'lodash';
import moment 	from 'moment';

import * as Helpers from '../../helpers';
import * as $api from '../../api';
import * as _api from './api';

//import Select2 from '../Commons/Inputs/Select2.jsx'; 
import Select2 from 'react-select2-wrapper';
import NotFound from '../../tmpl/404.jsx';

/**
 * Map Store State to Props
 */
const mapStateToProps = state => { 
	return { 
		appdata: state.appdata, 
		user: state.users.user, 
		userDefault: state.users.userDefault, 
		filters: state.users.filters,
		filterParams: state.users.filterParams
	}; 
};

class _UserForm extends React.Component {
	
	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		
		this.state = {
			user: props.user && props.user.id ? _.cloneDeep( props.user ) : _.cloneDeep( props.userDefault ),
			managers: [],
			edited: false,
			
			changePassword: true
		}
		
		
		this.state.user.type = props.filters.type; 
		
		
		this.formChange 		= this.formChange.bind(this);
		this.upsertUser 		= this.upsertUser.bind(this);
		this.toggleRole			= this.toggleRole.bind(this);
		this.addLocation		= this.addLocation.bind(this);
		this.locationFormUpdate = this.locationFormUpdate.bind(this);
		this.locationAction = this.locationAction.bind(this);
		this.assignLocation = this.assignLocation.bind(this);
		this.assignCategory = this.assignCategory.bind(this);
		
		
	}
	
	
	/**
	 * Validate then Upsert User 
	 */
	upsertUser() {
		let user = this.state.user;
		let errors = [];
		
		if( user.id == 'new' && user.pass == '' ) errors.push("Please enter a password.");
		if( user.pass != '' && user.pass != this.state.user.pass_confirm ) errors.push("Passwords do not match.");
		
		if( errors.length > 0 ) {
			alert("ERROR: The following errors were found:\n- "+ errors.join("\n- ") );
			return false;
		}
		
		_api.upsertUser(user);
		
		
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
	 * Toggle Role
	 */
	toggleRole(v) {
		this.setState({...this.state, user: {...this.state.user, type: v}});
	}
	
	
	
	/**
	 * Add Location
	 */
	addLocation(e) {
		if(e) {e.preventDefault(); e.stopPropagation();}
		let state = this.state;
		let userLocation = { ul_id: 'new', id: 0, address_street: '', address_city: '', address_state: '', address_zip: '', edit: 1 };
		
		state.user.locations = state.user.locations || [];
		state.user.locations.push(userLocation);
		
		this.setState(state);
		
	}
	
	
	/**
	 * Update User Location Item
	 */
	locationFormUpdate(e, i) {
		if(e) {e.preventDefault(); e.stopPropagation();}
		let state = this.state;
		
		if( !state.user.locations[i] ) return false; 
		
		let {name, value} = e.target;
		
		if( state.user.locations[i] ) {
			state.user.locations[i][name] = value;
			
			// Add Location_Name (City, State)
			if( name== "id" ) {
				let locations = this.props.filterParams.locations;
				let location 	= _.find(locations, {id: value});
				
				if(location) {
					state.user.locations[i].location_name = location.city + ", " + location.state; 
				}
				
			}
		}
		
		this.setState(state);
	}
	
	
	/**
	 * Location Actions
	 */
	locationAction(e,i,action) {
		if(e){ e.preventDefault();e.stopPropagation();}
		let state = this.state;
		
		if( action == 'edit' ) {
			state.user.locations[i].edit = 1;
		}
		
		else if( action == 'close' ) {
			state.user.locations[i].edit = 0;
		}
		
		else if( action == 'remove' ) {
			state.user.locations.splice(i, 1);
		}
		
		this.setState(state);
		
	}
	
	
	
	/**
	 * Assign Location
	 */
	assignLocation(id) {
		let state = this.state;
		state.user.locations = state.user.locations || [];
		let exists = _.find(state.user.locations, {id: id}) != undefined;
		if( exists ) state.user.locations = _.filter(state.user.locations, o => o.id != id );
		else state.user.locations.push( {ul_id: 'new', id: id} );
		this.setState(state);
	}
	
	
	/**
	 * Assign Category
	 */
	assignCategory(e) {
		let state = this.state;
		
		let data = e.params.data; 
		
		state.user.categories = state.user.categories || [];
		if( !data.selected ) state.user.categories = _.filter(state.user.categories, o => o.id != data.id );
		else state.user.categories.push( {uc_id: 'new', id: data.id} );
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
			
			let user = this.state.user; 
			let locations = props.filterParams.locations;
			
			let disableBtn = props.appdata.loading ? 'disabled' : '';
			
			return (
				<div className="content-wrapper">
					
					
					<div className="content-top">
						<ul>
							<li><Link to={Config.root} className="" >Home</Link></li>
							<li><Link to={Config.root + "users/"} className="" >Users</Link></li>
							<li><Link to={window.location.href} className="active" >{ user && user.id != 'new' ? 'Edit' : "New" }</Link></li>
						</ul>
					</div>
					
					<section className="content-header">
						<div className="pull-left">
							<h1 style={{margin: '0'}}>
								{ user && user.id != 'new' ? user.name : 'Add User' }
							</h1>
						</div>
						
						<div className="pull-right box-tools">
							<button type="button" className={"btn btn-success btn-sm btn-flat " + disableBtn} onClick={this.upsertUser}>
								<i className="fa fa-cloud-upload"></i> Save
							</button>
							
							{user && user.id != 'new' ? 
								<button className={ "btn btn-danger btn-sm btn-flat " + disableBtn } onClick={(e)=>_api.remove(user.id)}>
									<i className="fa fa-trans"></i> Delete
								</button> 
								: null 
							}
							
							<button type="button" className={ "btn btn-default btn-sm btn-flat" + disableBtn } onClick={(e)=>_api.close(null, user)}>Close</button>
						</div>
						
						<div style={{clear: 'both'}}></div>
					</section>
					
					<section className="content">
						<div className="row">
						
						
							<form className="form-horizontal">
						
								<div className="col-sm-6 ">
														
									<div className="box box-default">
										<div className="box-header with-border ">
											<h3 className="box-title"><i className="fa fa-info"></i> General Information</h3>
										</div>
										<div className="box-body">
										
											<div className="form-group">
												<label htmlFor="input-type" className="col-sm-4 control-label">Role</label>
												<div className="col-sm-8">
													<div className="form-group" style={{padding: 8, margin: 0}}>
														<div className="btn-group">
															<button style={{fontSize: "13px", paddingLeft:8, paddingRight:8}} type="button" className={"btn btn-flat " + ( state.user.type == 'technician' ? 'active btn-success' : 'btn-default' )} onClick={(e)=>this.toggleRole('technician') }>Technician</button>
															<button style={{fontSize: "13px", paddingLeft:8, paddingRight:8}} type="button" className={"btn btn-flat " + ( state.user.type == 'distributor' ? 'active btn-success' : 'btn-default' )} onClick={(e)=>this.toggleRole('distributor') }>Distributor</button>
															<button style={{fontSize: "13px", paddingLeft:8, paddingRight:8}} type="button" className={"btn btn-flat " + ( state.user.type == 'dispatcher' ? 'active btn-success' : 'btn-default' )} onClick={(e)=>this.toggleRole('dispatcher') } >Dispatcher</button>
															{$api.allowed(['admin']) ? 
																<button style={{fontSize: "13px", paddingLeft:8, paddingRight:8}} type="button" className={"btn btn-flat " + ( state.user.type == 'admin' ? 'active btn-success' : 'btn-default' )} onClick={(e)=>this.toggleRole('admin') } >Admin</button> : null
															}
														</div>
														{/** 
														<label style={{marginRight: 15}}  >
															<input type="radio" name="type" value="technician" checked={state.user.type == 'technician'} onChange={this.formChange} /> Technician
														</label>
														<label >
															<input type="radio" name="type" value="dispatcher" checked={state.user.type == 'dispatcher'}  onChange={this.formChange} /> Dispatcher
														</label>*/}
													</div>
												</div>
											</div>
											
											<div className="form-group">
												<label htmlFor="input-name_first" className="col-sm-4 control-label">First Name</label>
												<div className="col-sm-8">
													<input type="text" name="name_first" className="form-control" id="input-name_first" placeholder="First Name" value={state.user.name_first}  onChange={this.formChange} />
												</div>
											</div>
											
											<div className="form-group">
												<label htmlFor="input-name_last" className="col-sm-4 control-label">Last Name</label>
												<div className="col-sm-8">
													<input type="text" name="name_last" className="form-control" id="input-name_last" placeholder="Last Name" value={state.user.name_last}  onChange={this.formChange} />
												</div>
											</div>
											
											<div className="form-group">
												<label htmlFor="input-email" className="col-sm-4 control-label">Email</label>
												<div className="col-sm-8">
													<input type="text" name="email" className="form-control" id="input-email" placeholder="Email" value={state.user.email}  onChange={this.formChange} />
												</div>
											</div>
											
											<div className="form-group">
												<label htmlFor="input-slack_email" className="col-sm-4 control-label">Slack Email</label>
												<div className="col-sm-8">
													<input type="text" name="slack_email" className="form-control" id="input-slack_email" placeholder="Slack Email" value={state.user.slack_email}  onChange={this.formChange} />
												</div>
											</div>
											
											<div className="form-group">
												<label htmlFor="input-phone" className="col-sm-4 control-label">Mobile Number</label>
												<div className="col-sm-8">
													<input type="text" name="phone" className="form-control" id="input-phone" placeholder="Mobile No." value={state.user.phone}  onChange={this.formChange} />
													<p>Please use E.164 format for Twilio compatibility (e.g. +13472626329). <a href="https://www.twilio.com/docs/glossary/what-e164" target="_blank">More Info</a></p>
												</div>
											</div>
											
											<div className="form-group">
												<label htmlFor="input-status" className="col-sm-4 control-label">Status</label>
												<div className="col-sm-4">
													<select name="status" className="form-control" id="input-status" value={state.user.status} onChange={this.formChange}>
														<option value="1">ACTIVE</option>
														<option value="0">INACTIVE</option>
													</select>
												</div>
											</div>
											
											
											
											<div className="form-group">
												<label htmlFor="input-notes" className="col-sm-4 control-label">Notes</label>
												<div className="col-sm-8">
													<textarea className="form-control" name="notes" placeholder="Notes" id="input-notes" value={state.user.notes}  onChange={this.formChange} rows={4} ></textarea>
												</div>
											</div>
											
											<div className="form-group">
												<label htmlFor="input-pass" className="col-sm-4 control-label">Password</label>
												<div className="col-sm-8">
													{ state.changePassword ? 
														<input type="password" name="pass" className="form-control" id="input-pass" placeholder="Password" value={state.user.pass}  onChange={this.formChange} />
														: <a href="javascript:;" onClick={()=>this.setState({...this.state, changePassword: true})}>Change Password</a> 
													}
												</div>
											</div> 
											
											{ state.changePassword ? 
												<div className="form-group">
													<label htmlFor="input-pass_confirm" className="col-sm-4 control-label">Confim Password</label>
													<div className="col-sm-8">
														<input type="password" name="pass_confirm" className="form-control" id="input-pass_confirm" placeholder="Password" value={state.user.pass_confirm}  onChange={this.formChange} />
													</div>
												</div> : ''
											}
											
										
										</div>
										
									</div>
									
								
								
								</div>
								
								{/** Technician Work Info */}
								{ state.user.type == 'technician' ? 
									<div className="col-sm-6">
										
										<div className="box box-default">
											<div className="box-header with-border ">
												<h3 className="box-title"><i className="fa fa-tags"></i> Work Info</h3>
											</div>
											<div className="box-body" style={{padding: '10px 25px'}}>
												
												<div className="form-group">
													<label htmlFor="input-hourly_rate" className="col-sm-4 control-label" style={{textAlign: 'left'}} >Hourly Rate</label>
													<div className="col-sm-8">
														<div className="input-group">
															<div className="input-group-addon"><i className="fa fa-dollar"></i></div>
															<input type="text" name="hourly_rate" className="form-control" id="input-hourly_rate" placeholder="0.00" value={state.user.hourly_rate}  onChange={this.formChange} />
														</div>
													</div>
												</div>
												
												<div className="form-group">
													<label htmlFor="input-categories" className="col-sm-12 control-label" style={{textAlign: 'left'}}>Categories</label>
													<div className="col-sm-12">
													
														<Select2 id="categories" className="form-control"
															data={
																props.filterParams.categories && props.filterParams.categories.length ? _.map( props.filterParams.categories, cat => {
																	return { id: cat.id, text: cat.name }
																} ) : [] }
															multiple
															onSelect={(e)=>this.assignCategory(e)}
															onUnselect={(e)=>this.assignCategory(e)}
															value={ state.user.categories && state.user.categories.length ? _.map( state.user.categories, cat => (cat.id) ) : [] }
															name="category_ids" 
															options={{
																placeholder: 'Select Categories'
															}}
															/>
															
													</div>
												</div>
													
											</div>
										</div>
										
										<div className="box box-default">
											<div className="box-header with-border ">
												<h3 className="box-title"><i className="fa fa-map-pin"></i> Assign Locations</h3>
											</div>
											<div className="box-body" style={{padding: '10px 25px'}}>
												
												{/**  state.user.type == 'technician' ? 
													<div className="form-group">
														{ locations && locations.length ? locations.map((location, i )=>{
																let checked = _.find( state.user.locations, {id: location.id} ) != undefined ? true : false; 
																
																return (
																	<div className="checkbox" key={i}>
																		<label>
																			<input type="checkbox" value={location.id} ref={ "input_properties_" + location.id } onChange={(e)=>this.assignLocation(location.id)} checked={checked} />
																			{location.city}, {location.state}
																		</label>
																	</div>
																)
															}) : 'No locations found.'
														}
													</div>
													: <p>Dispatchers can access all properties.</p>
												*/}
												
												{ state.user.type == 'technician' ? 
													<div>
														{state.user.locations && state.user.locations.length ? state.user.locations.map( (userLocation, i) => {
															
															if( userLocation.edit ) {
																return (
																	<div key={i} className="user-location" style={{padding: '10px 0', borderBottom: '1px solid #cccccc', marginBottom: 15}} >
																		<div className="user-location-top" style={{padding: '8px 0'}} >
																			<div className="pull-left">
																				<div style={{width: '160px'}}>
																					<select className="form-control" value={userLocation.id} onChange={(e)=>this.locationFormUpdate(e, i)} name="id">
																						<option value="">-Select Location-</option>
																						{locations && locations.length ? locations.map( (loc,j) => (<option key={j} value={loc.id}>{loc.city}, {loc.state}</option>) ) : null 
																						}
																					</select>
																				</div>
																			</div>
																			<div className="pull-right text-right">
																				<button type="button" className="btn btn-flat btn-default btn-sm" title={"Close"} onClick={(e)=>this.locationAction(e,i,'close')} ><i className="fa fa-times"></i></button>&nbsp;
																			</div>
																			<div className="clearfix"></div>
																		</div>
																		
																		<div className="user-location-form">
																			<div className="form-group">
																				<div className="col-sm-12">
																					<textarea name="address_street" className="form-control" id="input-address_street" placeholder="Street Address..." value={userLocation.address_street}  onChange={(e)=>this.locationFormUpdate(e,i)} rows={2} />
																				</div>
																			</div>
																			
																			<div className="form-group">
																				<div className="col-sm-5">
																					<input type="text" name="address_city" className="form-control" id="input-address_city" placeholder="City..." value={userLocation.address_city}  onChange={(e)=>this.locationFormUpdate(e,i)} />
																				</div>
																				<div className="col-sm-3">
																					<input type="text" name="address_zip" className="form-control" id="input-address_zip" placeholder="ZIP..." value={userLocation.address_zip}  onChange={(e)=>this.locationFormUpdate(e,i)} />
																				</div>
																			</div>
																			
																		</div>
																		
																	</div>
																);
															}
															
															else {
																let address = [];
																if(userLocation.address_street) address.push( userLocation.address_street );
																if(userLocation.address_city) address.push( userLocation.address_city );
																if(userLocation.address_zip) address.push( userLocation.address_zip );
																
																return(
																	<div key={i} className="user-location" style={{padding: '10px 0', borderBottom: '1px solid #cccccc', marginBottom: 15}} >
																		<div className="user-location-top" style={{padding: '8px 0'}} >
																			<div className="pull-left">
																				<b>{userLocation.location_name}</b>
																			</div>
																			<div className="pull-right text-right">
																				<button type="button" className="btn btn-flat btn-default btn-sm" title={"Edit"} onClick={(e)=>this.locationAction(e,i,'edit')}><i className="fa fa-pencil"></i> Edit</button>&nbsp;
																				<button type="button" className="btn btn-flat btn-default btn-sm" title={"Remove"} onClick={(e)=>this.locationAction(e,i,'remove')} ><i className="fa fa-trash"></i></button>&nbsp;
																			</div>
																			<div className="clearfix"></div>
																		</div>
																		
																		<div className="user-location-form">
																			{address.length ? <a href={ "https://www.google.com/maps/search/?api=1&query=" + address.join(", ") + ", " + userLocation.location_name } target="_blank">{address.join(", ") }</a> : <span style={{color: '#aaa'}}>No address found. Please specify.</span> }
																		</div>
																		
																	</div>
																);
															}
															
														}) : "No location added." }
													</div> : null
												}
												
												<button className="btn btn-primary btn-sm btn-flat" onClick={(e)=>this.addLocation(e)} ><i className="fa fa-map-pin"></i> Add</button>

											</div>
										</div>
									</div> : null
								}
							
							</form>
							
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
		if( $api.allowed( ['admin', 'dispatcher'] ) ) {
			_api.getUserDetails( this.props.params.id );
		}
		
		$api.setPage('users');
	}
	
	
	/**
	 * Component Did Update
	 */
	componentDidUpdate() {
		
	}
	
	
	/**
	 * Update New Props
	 */
	componentWillReceiveProps(props) {
		if( $api.allowed( ['admin', 'dispatcher'] ) ) {
			
			if(JSON.stringify(this.props) !== JSON.stringify(props) ) 
				if( props.user && props.params.id != 'new' ) 
					this.setState({...this.state, user: props.user, changePassword: false });
				
		}
	}
	
	
	/**
	 * Component Will Unmount
	 */
	componentWillUnmount() {
		_api.clearUser();
	}
	
}


const UserForm = connect(mapStateToProps)(_UserForm); 
export default UserForm;
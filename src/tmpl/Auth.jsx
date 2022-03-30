import React 		from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';


import * as $api from '../api';
import * as Helpers from '../helpers';
import Select2 from 'react-select2-wrapper'; 

/**
 * Map Store State to Props
 */
const mapStateToProps = state => { 
	
	return { 
		appdata: state.appdata,
		reset_link_verified: state.appdata.reset_link_verified,
		routing: state.routing, 
		signupParams: state.appdata.signupParams,
		path: state.routing.locationBeforeTransitions.pathname 
	};
	
};


/**
 * Main Class
 */
class _Login extends React.Component {
	
	
	/**
	 * Constructor
	 */
	constructor(props) {
		super(props);
		
		this.state = {
			remember_me: true,
			newUserDefault: {
				name: '',
				name_first: '',
				name_last: '',
				email: '',
				pass: '',
				phone: '',
				categories: [],
				locations: []
			},
			newUser: null,
			signupParams: {
				categories: [],
				locations: []
			}
		}
		
		this.state.newUser = { ...this.state.newUserDefault };
		
		this.stopLogin = this.stopLogin.bind(this);
		this.requestResetPassword = this.requestResetPassword.bind(this);
		this.setNewPassword = this.setNewPassword.bind(this);
		this.toggleRemember = this.toggleRemember.bind(this);
		this.signup = this.signup.bind(this);
		this.signupFormChange = this.signupFormChange.bind(this);
		this.signupSelectCategory	= this.signupSelectCategory.bind(this);
		this.signupSelectLocation = this.signupSelectLocation.bind(this);
		
	}
	
	
	/**
	 * Process Login
	 */
	stopLogin(e) {
		e.preventDefault(); e.stopPropagation();
		let u = {
			email:	ReactDOM.findDOMNode(this.refs.login_email).value.trim(),
			pass:		ReactDOM.findDOMNode(this.refs.login_pass).value.trim()
		};
		
		if( u.email.length < 1 || u.pass.length < 1 ) alert("ERROR: Email address and password cannot be empty.");
		else $api.login(u);
		
	}
	
	
	/**
	 * Request Reset Password
	 */
	requestResetPassword(e) {
		if(e) { e.preventDefault(); e.stopPropagation(); }
		
		let email = this.refs.reset_email.value.trim();
		
		// Verify
		if( email == '' ) alert("Please enter your email!");
		else $api.reset(email);
		
	}
	
	
	/**
	 * Set New Password
	 */
	setNewPassword(e) {
		if(e){ e.preventDefault(); e.stopPropagation(); }
		
		let pass = this.refs.reset_password.value.trim();
		let pass_confirm = this.refs.reset_password_confirm.value.trim();
		
		// Validate
		let errors = [];
		if( pass == '' ) errors.push('Password must not be empty.' );
		if ( pass.length <= 5 ) errors.push('Password must be at least 5 characters long.');
		if ( pass != pass_confirm ) errors.push('Passwords do not match.');
		
		if( errors.length > 0 ) {
			alert("ERROR: Please fix the following errors found: \n- " + errors.join("\n- "));
			return false; 
		}
		
		$api.setpass( {reset_key: this.props.params.reset_key, pass: pass} );
		
	}
	
	
	/**
	 * Toggle Remember
	 */
	toggleRemember() {
		this.setState({...this.state, remember_me: !this.state.remember_me});
	}
	
	
	/**
	 * Signup
	 */
	signup(e) {
		if(e) {e.preventDefault(); e.stopPropagation();}
		$api.signup( this.state.newUser );
	}
	
	
	/**
	 * Signup Form Change
	 */
	signupFormChange(e) {
		let state = this.state;
		state.newUser[ e.target.name ] = e.target.value;
		this.setState(state);
	}
	
	
	/**
	 * Signup Select Category
	 */
	signupSelectCategory(e) {
		
		let state = this.state;
		
		let data = e.params.data; 
		
		state.newUser.categories = state.newUser.categories || [];
		if( !data.selected ) state.newUser.categories = _.filter(state.newUser.categories, o => o.id != data.id );
		else state.newUser.categories.push( {uc_id: 'new', id: data.id, name: data.name } );
		this.setState(state); 
		
	}
	
	
	/**
	 * Signup Select Location
	 */
	signupSelectLocation(e) {
		
		let state = this.state;
		
		let data = e.params.data; 
		
		state.newUser.locations = state.newUser.locations || [];
		if( !data.selected ) state.newUser.locations = _.filter(state.newUser.locations, o => o.id != data.id );
		else state.newUser.locations.push( { ul_id: 'new', id: data.id, name: data.name } );
		this.setState(state); 
		
	}
	
	
	showTip(e) {
		
	}
	
	
	
	/**
	 * Render
	 */
	render() {
	  let props = this.props; 
		let state = this.state; 
		
		let categories = props.categories ? props.categories : state.categories;
		let locations = props.locations ? props.locations : state.locations; 
		
	  return (
			<div className="login-box">
				<div className="login-logo">
					<Link to={Config.root} style={{color: '#efefef'}}>
						<img src={Config.assets + "icons/favicon.png"} style={{height: 70}}/> <b style={{color: '#ffffff'}}>Jervis</b></Link>
				</div>

				{/** Show Login Form */}
				{ props.path == Config.root && ( !props.appdata.users || !props.appdata.users.id ) ? 
					<div className="login-box-body">
						
						<p className="login-box-msg">Sign in to start your session</p>

						<form action="/" method="post" >
							
							<div className="form-group has-feedback">
								<input type="text" className="form-control" placeholder="Email" ref="login_email" required="required"/>
								<span className="glyphicon glyphicon-envelope form-control-feedback"></span>
							</div>
							
							<div className="form-group has-feedback">
								<input type="password" className="form-control" placeholder="Password" ref="login_pass" required="required" />
								<span className="glyphicon glyphicon-lock form-control-feedback"></span>
							</div>
							
							<div className="row">
								<div className="col-xs-8">
									<div className="checkbox icheck">
										<label>
											<input type="checkbox" checked={true}  /> Remember Me
										</label>
									</div>
								</div>

								<div className="col-xs-4">
									<button type="submit" className="btn btn-primary btn-block btn-flat" onClick={this.stopLogin} >Sign In</button>
								</div>
							</div>

						</form>
						
						<Link to={Config.root + "reset-password/"}>I forgot my password</Link><br/>

					</div> : null 
				}
				
				
				{/** Show Reset Password Form */}
				{props.path == Config.root + "reset-password/" ?
					<div className="login-box-body">
						
						<p className="login-box-msg">Please enter your email address</p>

						<form action="/" method="post" >
							
							<div className="form-group has-feedback">
								<input type="text" className="form-control" placeholder="Email" ref="reset_email" required="required"/>
								<span className="glyphicon glyphicon-envelope form-control-feedback"></span>
							</div>
							
							<div className="row">
								
								<div className="col-xs-6">
									<Link to={Config.root}><i className="fa fa-long-arrow-left"></i> Back</Link>
								</div>
								
								
								<div className="col-xs-6 pull-right">
									<button type="submit" className="btn btn-primary btn-block btn-flat" onClick={this.requestResetPassword} >Reset Password</button>
								</div>
							</div>

						</form>

					</div> : null 
				}
				
				
				{/** Verify Reset Password */}
				{ props.path.indexOf( 'verify-reset-password' ) > -1 && !props.reset_link_verified ? 
					<div className="login-box-body">
						<span className="login-box-msg">Verifying password reset request...</span>
					</div> : null 
				}
				
				{ props.path.indexOf( 'verify-reset-password' ) > -1 && props.reset_link_verified ?
					
					<div className="login-box-body">
						<p className="login-box-msg">Please enter your new password</p>

						<form action="/" method="post" >
							<div className="form-group has-feedback">
								<input type="password" className="form-control" placeholder="Password" ref="reset_password" required="required" />
								<span className="glyphicon glyphicon-lock form-control-feedback"></span>
							</div>
							
							<div className="form-group has-feedback">
								<input type="password" className="form-control" placeholder="Confirm Password" ref="reset_password_confirm" required="required" />
								<span className="glyphicon glyphicon-lock form-control-feedback"></span>
							</div>
							
							<div className="row">

								<div className="col-xs-12">
									<button type="submit" className="btn btn-primary btn-block btn-flat" onClick={this.setNewPassword} >Reset Password</button>
								</div>
							</div>

						</form>
					</div>
				
					: null
				}
				
				
				{/** Signup form for Technician */}
				{ props.path == Config.root ? 
					<div className="signup-link-box" style={{display: 'block', padding: '10px 10px 0 10px', textAlign: 'center', color: '#ffffff' }}>
						<div style={{display: 'block', textAlign: 'center', color: '#ffffff', margin: '30px'}}>
							<span style={{display: 'inline-block', width: '40%', height: '1px', position: 'relative', left: -15, top: -5 }} className="bg-gray"></span>
								Or
							<span style={{display: 'inline-block', width: '40%',  height: '1px', position: 'relative', left: 15, top: -5 }} className="bg-gray"></span>
						</div>
						
						<div style={{display: 'block', textAlign: 'center'}}>
							<a href={Config.root + "signup/"} className="btn btn-success btn-flat" >Create my Technician Account</a>
						</div>
						
					</div> : null
				}
				
				{/** Signup Form */}
				{ props.path == Config.root + 'signup/' ? 
					<div className="login-box-body">
						
						<p className="login-box-msg">You are signing up as a <b>Technician</b>. </p>

						<form action="/" method="post" >
							
							<div className="form-group has-feedback">
								<input type="text" className="form-control" placeholder="First Name" value={state.newUser.name_first} onChange={this.signupFormChange} name="name_first" />
								<span className="glyphicon glyphicon-user form-control-feedback"></span>
							</div>
							
							<div className="form-group has-feedback">
								<input type="text" className="form-control" placeholder="Last Name" value={state.newUser.name_last} onChange={this.signupFormChange} name="name_last" />
								<span className="glyphicon glyphicon-user form-control-feedback"></span>
							</div>
			
							<div className="form-group has-feedback">
								<input type="text" className="form-control" placeholder="Email" value={state.newUser.email} onChange={this.signupFormChange} name="email" />
								<span className="glyphicon glyphicon-envelope form-control-feedback"></span>
							</div>
							
							<div className="form-group has-feedback">
								<input type="password" className="form-control" placeholder="Password" value={state.newUser.pass} onChange={this.signupFormChange} name="pass" />
								<span className="glyphicon glyphicon-lock form-control-feedback"></span>
							</div>
							
							<div className="form-group has-feedback">
								<input type="text" className="form-control" placeholder="Phone Number (e.g. +18555440652)" value={state.newUser.phone} onChange={this.signupFormChange} name="phone" />
								<span className="glyphicon glyphicon-phone form-control-feedback"></span>
							</div>
							
							<div className="row" style={{marginBottom: 20}}>
								<label className="col-xs-12">Capabilities (<a href="#" title="Select categories for projects you are able to work on.  Only select those categories for which you have hands on experience or have done very similar work." onClick={(e)=>this.showTip(e)} className="tooltip-help" >Help</a>):</label>
								<div className="col-xs-12">
									<Select2 id="categories" className="form-control"
										data={
											state.signupParams && state.signupParams.categories && state.signupParams.categories.length ? _.map( state.signupParams.categories, cat => {
												return { id: cat.id, text: cat.name }
											} ) : [] }
										multiple
										onSelect={(e)=>this.signupSelectCategory(e)}
										onUnselect={(e)=>this.signupSelectCategory(e)}
										defaultValue={ state.newUser.categories && state.newUser.categories.length ? _.map( state.newUser.categories, cat => (cat.id) ) : [] }
										name="categories" 
										options={{
											placeholder: 'Select Skills',
											rows: 2
										}}
										/>
								</div>
							</div>
							
							
							<div className="row" style={{marginBottom: 20}}>
								<label className="col-xs-12">Areas willing to serve (<a href="#" title="Select the closes city to you to see projects in and around that city. Our administrator will start you off with a 20 mile radius from your home zip code." onClick={(e)=>this.showTip(e)} className="tooltip-help">Help</a>):</label>
								<div className="col-xs-12">
									
									<Select2 id="locations" className="form-control"
										data={
											state.signupParams && state.signupParams.locations && state.signupParams.locations.length ? _.map( state.signupParams.locations, loc => {
												return { id: loc.id, text: loc.name }
											} ) : [] }
										multiple
										onSelect={(e)=>this.signupSelectLocation(e)}
										onUnselect={(e)=>this.signupSelectLocation(e)}
										defaultValue={ state.newUser.locations && state.newUser.locations.length ? _.map( state.newUser.locations, loc => (loc.id) ) : [] }
										name="locations" 
										options={{
											placeholder: 'Select Cities',
											rows: 2
										}}
									/>
									
								</div>
							</div>
							
							<div className="row" style={{marginBottom: 20}}>
								<div className="col-xs-12">
									<div className="checkbox icheck">
										<label>
											<input type="checkbox" checked={true} /> I agree to the <a href={Config.root + "terms/" } target="_blank">terms and conditions</a>.
										</label>
									</div>
								</div>
							</div>
							
							<div className="row">
								<div className="col-xs-12">
									<div className="pull-right"> 
										<button type="button" className="btn btn-success btn-block btn-flat" onClick={(e)=>this.signup(e)} >Create my Account</button>
									</div>
								</div>
							</div>

						</form>
						
					</div> : null 
				}
				
				
				
				
				{/** Signup Success */}
				{ props.path == Config.root + 'signup/success/' ? 
					<div className="login-box-body">
						<p>Your account will be reviewed by our administrators shortly. Please wait for confirmation email.</p>
					</div> : null 
				}
				

			</div>
      )
  }
	
	
	/**
	 * Component Will Mount
	 */
	componentWillMount() {
		
		// Verify Reset Password
		if( this.props.params.reset_key && this.props.params.reset_key != '' ) {
			$api.verify( this.props.params.reset_key );
		}
		
		if( this.props.path == Config.root + 'signup/' ) {
			$api.signupParams(); 
		}
		
	}
	
	
	/**
	 * Component Did Mount
	 */
	componentDidMount() {
		
		$(function () {
			
			if( $('.login-box input[type=text]').length > 0 ) $('.login-box input[type=text]')[0].focus();
			
			if(!$('body').hasClass('login-page')) {
				//$('body').addClass('login-page').attr('style', "padding-top: 1px; background: url('" + Config.assets + "images/background.jpg') center center fixed");
				$('html,body, #app').css({height: '100%'});
			}
			
			$.AdminLTE.layout.fix();
			
			// iCheck
			if($('.login-box input[type=checkbox]').length) {
				$('.login-box input[type=checkbox]').iCheck({
					checkboxClass: 'icheckbox_square-blue',
					radioClass: 'iradio_square-blue',
					increaseArea: '20%' // optional
				});
			}
			
			// Trigger Tooltip
			$(".tooltip-help").tooltip({
				trigger: 'click', 
				placement: 'top'
			});
			
		});
		  
	}
	
	
	/**
	 * Component Will Receive Props
	 */
	componentWillReceiveProps( props ) {
		
		if( props.path == Config.root + 'signup/' && !props.signupParams ) {
			$api.signupParams(); 
		}
		
		if( JSON.stringify( props.signupParams ) != JSON.stringify( this.state.signupParams ) ) 
			this.setState({...this.state, signupParams: props.signupParams });
		
	}
	
	
	/**
	 * Component Did Update
	 */
	componentDidUpdate() {
		
		// iCheck
		if($('.login-box input[type=checkbox]').length) {
			$('.login-box input[type=checkbox]').iCheck({
			  checkboxClass: 'icheckbox_square-blue',
			  radioClass: 'iradio_square-blue',
			  increaseArea: '20%' // optional
			});
		}
	}
	
	
	/**
	 * Component Will Unmount
	 */
	componentWillUnmount() {
		if($('body').hasClass('login-page')) {
			$('body').removeClass('login-page').attr('style', "");
		}
		$('html,body, #app').css({height: 'auto'});
	}
	
	
}


const Login = connect(mapStateToProps)(_Login); 
export default Login;
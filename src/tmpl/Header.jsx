import React 		from 'react';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';

import * as Helpers from '../helpers'; 

import * as $api from '../api';
import * as apiNotifications from '../components/Notifications/api'; 


/**
 * Map Store State to Props
 */
const mapStateToProps = state => { 
	return { 
		appdata: state.appdata, 
		properties: state.properties, 
		unread: state.notifications.unread 
	}; 
};

class _Header extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			receivePayment: false,
			screen: 'xs'
		}
		
		this.toggle = this.toggle.bind(this);
		
	}
	
	toggle(e, mode, data) {
		let state = this.state;
		if(e) {e.preventDefault(); e.stopPropagation(); }
	}
	
	
  render() {
		
		let state = this.state;
		let data 	= this.props.appdata; 
		let props = this.props;
		
		let totalUnread = 0;
		if( props.unread && props.unread.length ) totalUnread = _.filter( props.unread, {date_read: '0000-00-00 00:00:00'} ).length; 
			
		return (
			<header className="main-header">
				
				{/* Logo */}
				{ $api.allowed( ['admin', 'dispatcher'] ) ?  
					<Link to={data.root} className="logo hidden-xs">
						<span className="logo-mini"><img src={Config.assets + "icons/favicon.png"} style={{height: 40}}/></span>
						<span className="logo-lg">Jervis</span>
					</Link> : null 
				}
				
				{/* Top Nav */}
				<nav className="navbar navbar-static-top">
					
					{/** Connecting */}
					{ !data.connected ? 
						<div style={{ display: 'block', width: '400px', position:'absolute', top: 0, left: '50%', marginLeft: '-200px', textAlign: 'center', zIndex: 10000 }}>
							<div className="alert alert-danger alert-dismissible" style={{ boxShadow: 'rgba(0,0,0,0.5) 0px 0px 10px' }}>
								<i className="fa fa-refresh fa-spin"></i> Could not connect to server. Retrying...
							</div>
						</div> : null
						
					}
					
					{/** FEATURE_TECHNICIAN: Add Container for full-width */}
					<div className={ $api.is('technician') ? 'container' : '' }>
					
					{ $api.allowed( ['admin', 'dispatcher'] ) ? 
						<a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
							<span className="sr-only">Toggle navigation</span>
						</a> : null
					}
					
					{ $api.allowed( ['admin', 'dispatcher'] ) ? 
						<div className="visible-xs float-left" >
							<Link to={data.root} className="navbar-brand" style={{paddingLeft: '2px'}}>
								<span className="logo-lg"><b>Tech</b>Scheduling</span>
							</Link>
						</div> : null
					}
					
					{ $api.allowed( ['technician'] ) ? 
						<div className="navbar-header">
							<Link to={data.root} className="navbar-brand"><b>Tech</b>Scheduling</Link>
							{/** <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse">
								<i className="fa fa-bars"></i>
							</button>*/}
						</div> 
						: null 
					}
					
					<div className="navbar-custom-menu">
						<ul className="nav navbar-nav">
							
							<li className="dropdown notifications-menu">
								<a href="#" className="dropdown-toggle" data-toggle="dropdown">
									<i className="fa fa-bell-o"></i>
									{totalUnread > 0 ? <span className="label label-warning">{ totalUnread > 99 ? '99+' : totalUnread }</span> : null}
								</a>
								<ul className="dropdown-menu">
									<li className="header">You have {totalUnread} notifications</li>
									<li>
										{/** -- inner menu: contains the actual data */}
										<div className="slimScrollDiv" style={{ position: 'relative', overflow: 'auto', width: 'auto', height: '200px' }}>
											<ul className="menu" style={{overflow: 'auto', width: '100%', height: 'auto'}} >
												{ props.unread && props.unread.length ? props.unread.map( (log,i) => {
														let link = Config.root + log.component + "/";
														link += (log.item_id && log.item_id != 0 ) ? log.item_id + "/" : '';
														
														let isUnread = log.date_read == '0000-00-00 00:00:00' ? 'notification-unread' : '';
														
														return ( <li key={i} className={"notification-item " + isUnread} >
															<Link to={link} style={{color: '#666'}} onClick={ (e)=> apiNotifications.read( log.id, e ) } >
																<span>{log.component == 'settings' ? <i className="fa fa-gear text-red"></i> : null }
																{log.component == 'projects' ? <i className="fa fa-book text-green"></i> : null }
																{log.component == 'users' ? <i className="fa fa-user text-aqua"></i> : null }
																{log.component == 'locations' ? <i className="fa fa-map-pin text-aqua"></i> : null }
																</span> <span className="message" dangerouslySetInnerHTML={{__html: log.message}}></span>  <br className="visible-xs"/><span style={{color: '#aaa'}}>
																	<small >{Helpers.tz(log.date_created).format("MMM D, YYYY, h:mm a")}</small>
																</span>
															</Link>
														</li> );
													}) : null
												}
											
										</ul><div className="slimScrollBar" style={{ background: 'rgb(0, 0, 0)', width: '3px', position: 'absolute', top: '0px', opacity: '0.4', display: 'block', borderRadius: '7px', zIndex: '99', right: '1px'}}></div><div className="slimScrollRail" style={{width: '3px', height: '100%', position: 'absolute', top: '0px', display: 'none', borderRadius: '7px', background: 'rgb(51, 51, 51)', opacity: 0.2, zIndex: 90, right: 1}} ></div></div>
									</li>
									<li className="footer">
										<Link to={Config.root + "notifications/"} onClick={(e)=>apiNotifications.readAll()} >See All</Link>
									</li>
								</ul>
							</li>
							
							<li className="dropdown user user-menu">
								<a href="#" className="dropdown-toggle" data-toggle="dropdown">
									<img src={Config.assets + "dist/img/user2-160x160.jpg"} className="user-image" alt="User Image" />
									<span className="hidden-xs">{ data.user.name_first + " " + data.user.name_last }</span>
								</a>
								
								<ul className="dropdown-menu">
								
									<li className="user-header">
										<img src={Config.assets + "dist/img/user2-160x160.jpg"} className="img-circle" alt="User Image" />
										<p> { data.user.name_first + " " + data.user.name_last }</p>
									</li>
									 
									<li className="user-footer">
										<div className="pull-left">
											<Link to={data.root + 'profile/'} className="btn btn-default btn-flat">Profile</Link>
										</div>
										<div className="pull-right">
											<Link to={data.root + 'logout' } onClick={$api.logout} className="btn btn-default btn-flat">Sign out</Link>
										</div>
									</li>
									
								</ul>
							</li>
						</ul>
					</div>
					
					<div className={ state.screen == 'xs' ? "navbar-custom-menu" : "pull-left " }>
						{/** 
						<form className="navbar-form navbar-left hidden-xs" role="search">
							<div className="form-group">
								<input type="text" className="form-control" id="navbar-search-input" placeholder="Search" />
							</div>
						</form> */}
							
					</div>
					
					
					</div>
				</nav>
				
			</header>
		)
   }
   
	componentDidMount() {
		let _this = this;
		let props = this.props;
		
		$(function () {
			
			// Update Sidebar Toggle Cookie
			$(document).on('click', '.sidebar-toggle', function(e) {
				if($('.sidebar-collapse').length) window.localStorage.setItem(Config.name + '_sidebar_collapse', "1");
				else window.localStorage.removeItem(Config.name + '_sidebar_collapse');
			});
			
			// Sidebar Toggle Cookie
			if(window.localStorage.getItem(Config.name + '_sidebar_collapse') && !$('.sidebar-collapse').length) {
				$('.sidebar-toggle').trigger('click');
			}
			
			// Login-page Header
			if($('body').hasClass('login-page')) {
				$('body').removeClass('login-page').attr('style', "height: auto");
			}
			
			// Detect User Type and Adjust Top Nav
			if( props.appdata.user ) {
				
				if ( $api.allowed( ['admin', 'dispatcher'] ) )
					$('body').removeClass('layout-top-nav');
				
			}
				
			
			
			
			$.AdminLTE.layout.fix();
			
			// Detect Bootstrap
			_this.state.screen = AppHelpers.getScreen();
			_this.setState(_this.state);
			
			// Automatic Resize
			$(window).resize( function() {
				
				AppHelpers.waitForFinalEvent( function() {
					_this.state.screen = AppHelpers.getScreen();
					_this.setState(_this.state);
				});
				
			});
			
	  });
	}
}


const Header = connect(mapStateToProps)(_Header); 
export default Header;
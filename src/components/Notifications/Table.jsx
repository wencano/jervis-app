import React from 'react';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';

import * as Helpers from '../../helpers';
import * as $api from '../../api';
import * as _api from './api';

const mapStateToProps = state => {
	return {notifications: state.notifications.notifications};
}

class _NotificationsTable extends React.Component {
	
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
		let state = this.state; 
		let props = this.props;
		
		return (
			<div>
				
				{props.notifications && props.notifications.length ? props.notifications.map( (log,i) => {
						let link = Config.root + log.component + "/";
						link += (log.item_id && log.item_id != 0 ) ? log.item_id + "/" : '';
						
						let isUnread = log.date_read == '0000-00-00 00:00:00' ? 'notification-unread' : '';
						
						return ( <p key={i} className={"notification-item " + isUnread}>
							<Link to={link} onClick={ ()=> _api.read( log.id ) } >
								<span>{log.component == 'settings' ? <i className="fa fa-gear text-red"></i> : null }
								{log.component == 'projects' ? <i className="fa fa-book text-green"></i> : null }
								{log.component == 'users' ? <i className="fa fa-user text-aqua"></i> : null }
								{log.component == 'locations' ? <i className="fa fa-map-pin text-aqua"></i> : null }
								</span> <span className="message" dangerouslySetInnerHTML={{__html: log.message}}></span>  <br className="visible-xs"/><span style={{color: '#aaa'}}>
									<small >{Helpers.tz(log.date_created).format("MMM D, YYYY, h:mm a")}</small>
								</span>
							</Link>
						</p> );
					}) : 
						<p>No notifications found.</p>
				}
				
				
				
				{ props.view && props.view == 'dashboard' ? <Link to={Config.root + "notifications/"}>See All</Link> : null }
				
				{ props.view && props.view == 'all' ? <button className="btn btn-info">SEE MORE</button> : null }
				
				
			</div>
		);
	}
	
	
	/**
	 * Before Component Mount
	 */
	componentWillMount() {
		
	}
	
	
	
}


const NotificationsTable = connect(mapStateToProps)(_NotificationsTable); 
export default NotificationsTable;
import React 		from 'react';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';


/**
 * Map Store State to Props
 */
const mapStateToProps = state => { 
	return { appdata: state.appdata}; 
};


let currentPage = '';
let _page = (page) => page == currentPage ? 'active' : '';


class _Sidebar extends React.Component {
	
	render() {
			
		const ACTIVE = { color: 'red' }
		let props = this.props;
		let data = this.props.appdata;
		let user = data.user; 
		currentPage = data.page; 
		
		return (
			<aside className="main-sidebar">
			  <section className="sidebar">
					
					<ul className="sidebar-menu">
						
						<li className="header">MAIN NAVIGATION</li>
						
						{/** Dashboard */}
						{ user.type == 'admin' ? 
							<li className={ _page('') }>
								<Link to={data.root} title="Dashboard">
									<i className="fa fa-dashboard"></i> <span>Dashboard</span>
								</Link>
							</li> : null 
						}

						{/** Projects */}
						{ user.type == 'admin' ? 
							<li className={ _page( 'projects' ) }>
								<Link to={data.root + "projects/"} title="Manage Projects">
									<i className="fa fa-book"></i> <span>Projects</span>
								</Link>
							</li> : null
						}

						{/** Issues */}
						{ user.type == 'admin' ? 
							<li className={ _page( 'issues' ) }>
								<Link to={data.root + "issues/"} title="Manage Issues">
									<i className="fa fa-tasks"></i> <span>Issues</span>
								</Link>
							</li> : null
						}

						{/** Users */}
						{ user.type == 'admin' ? 
							<li className={ _page( 'users' ) }>
								<Link to={data.root + "users/"} title="Manage Users">
									<i className="fa fa-users"></i> <span>Users</span>
								</Link>
							</li> : null
						}

						
						
						{/** ADMIN SECTION */}
						{ user.type == 'admin' ? <li className="header">ADMIN MENU</li> : null }
						
						
						{/** Settings */}
						{ user.type == 'admin' ? 
							<li className={data.page == 'settings' ? 'active' : '' }>
								<Link to={data.root + "settings/"} title="Global Settings">
									<i className="fa fa-gear"></i> <span>Settings</span>
								</Link>
							</li> : null 
						}
						
						
					</ul>
					
			  </section>
			</aside>
		  )
		}
	
	componentWillMount() {
		
	}
	
	componentDidMount(){
		$(function(){
			
			// Click Sidebar Item
			$(document).on('click', '.sidebar-menu li a',function(e) {
				
				// Hide on Tap (Mobile view only)
				if( $(window).width() < 768 ) $('.sidebar-toggle').trigger('click');
				
			});
			
			// Click Content Wrapper
			$(document).on('click', '.content-wrapper', function(e){
				if( $(window).width() < 768 && $('.sidebar-open').length ) $('.sidebar-toggle').trigger('click');
			});
			
		
		});
		
	}
}



const Sidebar = connect(mapStateToProps)(_Sidebar); 
export default Sidebar;
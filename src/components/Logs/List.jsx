import React from 'react';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';

import * as Helpers from '../../helpers';
import * as $api from '../../api';
import * as _api from './api';

import LogsTable from './Table.jsx';

const mapStateToProps = state => {
	return {logs: state.logs.logs};
}

class _Logs extends React.Component {
	
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
			<div className="content-wrapper">
				
				<div className="content-top">
					<ul>
						<li><Link to={Config.root} className="" >Home</Link></li>
						<li><Link to={Config.root + "logs/" } className="active" >Logs</Link></li>
					</ul>
				</div>
				
				<section className="content-header">
					
					<div className="pull-left">
						<h1 style={{margin: '0'}}><i className="fa fa-history"></i> My Activity History</h1>
					</div>
					
					<div className="pull-right box-tools"></div>
					
					<div style={{clear: 'both'}}></div>
				</section>
				
				
				<section className="content">
					<div className="row">
						<div className="col-sm-12" >
							
							<LogsTable />
						
						</div>
							
					</div>
				</section>
				
			</div>
		);
	}
	
	
	/**
	 * Before Component Mount
	 */
	componentWillMount() {
		$api.setPage('logs');
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


const Logs = connect(mapStateToProps)(_Logs); 
export default Logs;
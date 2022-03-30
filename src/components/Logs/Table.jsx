import React from 'react';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';

import * as Helpers from '../../helpers';
import * as $api from '../../api';
import * as _api from './api';

const mapStateToProps = state => {
	return {logs: state.logs.logs};
}

class _LogsTable extends React.Component {
	
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
		
		let logs = "No logs found.";
		if( props.logs && props.logs.length > 0 ) 
			logs = props.logs.map((log)=>{ return ( "[" + Helpers.tz( log.date_created ).format() + "] " + log.message ) }).join("\n");
		
		return (
			<div>
				<textarea className="" style={{width: "100%", padding: 11, fontFamily: 'monospace, Consolas, Courier New', fontSize: 11 }} value={logs} rows={25} readOnly={true}/>
			</div>
		);
	}
	
	
	/**
	 * Before Component Mount
	 */
	componentWillMount() {
		_api.get( this.props.filters || {} );
	}
	
	
	
}


const LogsTable = connect(mapStateToProps)(_LogsTable); 
export default LogsTable;
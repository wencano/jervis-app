import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';
import states from '../../../vendors/states';

/**
 * State
 */
export default class State extends React.Component {
	
	/**
	 * Render
	 */
	render() {
		let props = this.props;
		return ( 
			<select className={"form-control " + props.className} id={props.id} name={props.name} value={props.value} onChange={(e)=>props.onChange(e)} >
				<option value="">-Select State-</option>
				{states && states.length ? states.map( (state,i) => (
					<option key={i} value={state.abbreviation}>{state.name}</option>
				)) : null }
			</select>
		);
	}
	
}
import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';


/**
 * Radio Group
 */
export default class RadioGroup extends React.Component {
	
	/**
	 * Constructor
	 */
	constructor(props) {
		super(props);
		
	}

	
	/**
	 * Render
	 */
	render() {
		let props = this.props;
		return ( 
			<div className={props.className} >
				{props.options && props.options.length ? props.options.map( (opt, i) => {
					return (
						<label key={i} htmlFor={props.id + "-option-" + i} style={{marginRight: 10}}>
							<input type={"radio"} id={props.id + "-option-" + i} name={props.name} checked={props.value == opt.value} value={opt.value} onChange={(e)=>props.onChange(e)} /> {opt.label}
						</label>
					)}) : null
				}
			</div>
		);
	}
	
}
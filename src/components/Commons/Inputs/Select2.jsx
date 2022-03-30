import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';


export default class Select2 extends React.Component {
	
	
	constructor(props) {
		super(props);
		
		this.state = {
			
		}
		
		this.handleChange = this.handleChange.bind(this);
		
	}
	
	handleChange() {
		
		
	}
	
	
	render() {
		let props = this.props; 
		let options = props.options; 
		
		return (
			<div className="select2-wrapper">
				<select className="form-control" id={props.id || "select2" } multiple={props.multiple || "false" } style={{width: "100%"}} placeholder={props.placeholder} name={props.name} >
					{options && options.length ? options.map( ( opt, i ) => (
						<option key={i} value={opt.value}>{opt.text}</option>
					)) : null }
				</select>
			</div>
		);
		
	}
	
	componentDidMount() {
		let props = this.props;
		$(function() {
			//Initialize Select2 Elements
			$( "#" + ( props.id || "select2" ) ).select2();
			
			// Select/Unselect
			$( "#" + ( props.id || "select2" ) ).on('change', props.onChange );
		});
	}
	
}
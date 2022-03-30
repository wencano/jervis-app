import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';


/**
 * Quantity
 */
export default class Quantity extends React.Component {
	
	
	/**
	 * Constructor
	 */
	constructor(props) {
		super(props);
		this.change = this.change.bind(this);
	}
	
	
	/**
	 * Change Up or Down
	 * - dummy event object e, just to contain data
	 */
	change(dir) {
		let props = this.props;
		let e = {target: {name:  props.name, value: parseInt( props.value )} };
		
		if(dir == 'down' && e.target.value > 0 ) e.target.value -= 1;
		else if( dir == 'up' ) e.target.value += 1;
		
		props.onChange(e); 
		
	}
	
	/**
	 * Render
	 */
	render() {
		let props = this.props;
		return ( 
			<div className={"input-group input-group-sm " + props.className} style={props.style} >
				<div className="input-group-addon btn btn-default" onClick={(e)=>this.change("down")}><i className="fa fa-minus" ></i></div>
				<input type="text" value={props.value} onChange={(e)=>props.onChange(e)} className="form-control" />
				<div className="input-group-addon btn btn-default" onClick={(e)=>this.change("up")}><i className="fa fa-plus"></i></div>
			</div>
		);
	}
	
}
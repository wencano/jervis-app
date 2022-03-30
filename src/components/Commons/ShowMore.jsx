import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';
import nl2br 		from 'react-nl2br';


export default class ShowMore extends React.Component {

	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		this.state = {
			show: false, 
			text: '',
			limit: 100,
			nl2br: false,
			small: false,
			style: this.props.style != undefined ? this.props.style : {}
		}
		
		if(this.props.limit != undefined) this.state.limit = this.props.limit;
		if(this.props.nl2br != undefined) this.state.nl2br = this.props.nl2br; 
		if(this.props.small != undefined) this.state.small = this.props.small;
		if(this.props.text != undefined) this.state.text = this.props.text;		
		
		this.show = this.show.bind(this);
	}
	
	show( e, show ) {
		if(e){ e.preventDefault(); e.stopPropagation();}
		this.state.show = show == undefined ? !this.state.show : show;
		this.setState(this.state);
	}
	
	render() {
		
		let state = this.state;
		
		{/** Limit text if length < limit and !show, otherwise show all */}
		let text =  state.text.length > state.limit && !state.show ? state.text.substr(0, state.limit) + "..." : state.text ;
		
		{/** Change '\n' to <br /> */}
		text = state.nl2br ? nl2br( text ) : text;
		
		return (			
			<div style={state.style}>
				
				{text}
				
				{/** Show Link Button */}
				{ state.text.length > state.limit && !state.show ? 
					<div><a href="#" onClick={(e)=>this.show(e)}>Show More</a></div>
					: null 
				}
			
			</div>
		);
	}
	
	
	componentWillReceiveProps( props ) {
		if( JSON.stringify( this.props ) != JSON.stringify( props ) ) {
			this.state.text = props.text;
			this.state.limit = props.limit;
			this.setState(this.state);
		}
	}
	
	
	
}
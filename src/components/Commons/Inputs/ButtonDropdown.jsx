import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';
import states from '../../../vendors/states';


/**
 * Button Dropdown
 */
export default class ButtonDropdown extends React.Component {
	
	/**
	 * Constructor
	 */
	constructor(props) {
		super(props);
		
		this.state = {
			options: _.cloneDeep( props.options ),
			value: props.value,
			defaultValue: props.defaultValue,
			selected: {value: '', label: props.defaultLabel || '' }
		}		
		
		if( props.value && props.value != '' ) this.state.selected = _.find( this.state.options, {value: props.value} );
		else if( props.defaultValue && props.defaultValue != '' ) this.state.selected = _.find( this.state.options, {value: props.defaultValue} );
		
		if(!this.state.selected) this.state.selected = {value: '', label: props.defaultLabel || '' };
		
		this.onChange = this.onChange.bind(this);
		
	}
	
	
	/**
	 * On Change
	 */
	onChange(value) {
		let props = this.props;
		let state = this.state; 
		
		state.options.map((option,i) => {
			if( option.value == value )
				state.selected = _.cloneDeep( option );
		});
		
		let e = {
			target: {
				name: props.name,
				value: value
			}
		}
		
		this.setState(state);
		
		props.onChange(e);
		
	}
	
	
	
	/**
	 * Render
	 */
	render() {
		let props = this.props;
		let state = this.state; 
		
		return ( 
			<div className={props.className || ''} style={props.style||{}}>
				<button type="button" className={"btn btn-sm dropdown-toggle btn-" + (props.colorcoded ? state.selected.classColor : '')} data-toggle="dropdown" aria-expanded="false" style={props.buttonStyle||{}}>{state.selected.label} {props.caret ? <span className="fa fa-caret-down"></span> : null} 
				</button>
				<ul className="dropdown-menu">
					{state.options && state.options.length ? state.options.map( (option,i) => {
							return (
								<li key={i} className={ option.value == state.selected.value ? 'active' : '' }>
									<a href="javascript:(0);" onClick={()=>this.onChange(option.value)}>{option.label}</a>
								</li>
							)
						}) : null
					}
				</ul>
			</div>
		);
	}
	
	
	/**
	 * Component Will Receive Props
	 */
	componentWillReceiveProps(props) {
		let state = this.state; 
		
		if(JSON.stringify(this.props) != JSON.stringify(props)) {
			if( props.value && props.value != '' ) state.selected = _.find( state.options, {value: props.value} );
			if( props.defaultValue && props.defaultValue != '' ) state.selected = _.find( state.options, {value: props.defaultValue} );
			
			if(!state.selected) state.selected = {value: '', label: props.defaultLabel || '' };
			
			this.setState(state);
		}
		
	}
	
}
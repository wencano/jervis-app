import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';
import InputDate from './Date';


/**
 * Editable Input
 */
export default class EditableInput extends React.Component {
	
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
			<div className={"editable-input " + props.className || ''} style={(props.style||{})}>
        { props.type == 'date' && state.edit ? 
          <InputDate value={props.value} onChange={this.onChange} name={props.name} /> :
          props.formatDate(props.value)
        }
        <span className="editable-input-pencil "><i className="fa fa-pencil"></i></span>
			</div>
		);
	}
	
	
}
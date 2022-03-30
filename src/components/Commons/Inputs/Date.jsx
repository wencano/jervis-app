import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';


export default class InputDate extends React.Component {
	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		this.state = {
			inputId: 			props.inputId == undefined ? 'date' : props.inputId,
			inputClass: 	props.inputClass == undefined ? 'form-control input-sm' : props.inputClass,
			wrapperClass: props.wrapperClass == undefined ? 'input-group' : props.wrapperClass,
			value: 				props.value == undefined ? (props.defaultValue == undefined ? '' : props.defaultValue) : props.value,
			placeholder:	props.placeholder == undefined ? '' : props.placeholder,
			icon:					props.icon == undefined ? false : props.icon,
			name: 				props.name == undefined ? "date" : props.name, 
			autoclose: 		props.autoclose || false,
			revert:				props.revert || false
		}
	}
	
	render() {
		let state = this.state;
		return (
			<div className={state.wrapperClass} style={{width: '100%', maxWidth: '140px'}}>
				{state.icon ? <div className="input-group-addon"><i className="fa fa-calendar"></i></div> : null}
				<input type="text" id={state.inputId} className={state.inputClass} value={state.value} placeholder={state.placeholder} name={state.name} onChange={()=>1} />
			</div>
		);
	}
	
	componentDidMount() {
		
		let _this = this;
		let state = this.state;
		
		$(function(){
			
			// Date Picker
			$('#'+_this.state.inputId).datepicker({
				autoclose: _this.props.autoclose,
				format: 'yyyy-mm-dd',
				clearBtn: true
			}).on('changeDate', function(e){
				let origdate = state.value;
				let changeres = _this.props.onChange(e);
				
				if(_this.props.revert) {
					setTimeout(() => {
						if(changeres) {
							state.value = e.target.value;
							$('#'+_this.state.inputId).datepicker( 'update', state.value );
						}
						else {
							state.value = origdate;
							$('#'+_this.state.inputId).datepicker( 'update', state.value );
						}
					}, 50);
					
				}

			});
			
		});
	}
	
	componentWillUpdate(props) {
		let _this = this; let state = this.state;
		
		if( this.props.value != props.value ) {
			state.value = props.value || ""; 
			_this.setState(state);
			
			$('#'+_this.state.inputId).datepicker( 'update', state.value );
		}
		
	}
	
	
	
	componentWillUnmount() {
		$( '#' + this.state.inputId ).datepicker('destroy');
	}
	
	
}
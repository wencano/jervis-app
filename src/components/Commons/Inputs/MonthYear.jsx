import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';


export default class InputMonthYear extends React.Component {
	
	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		this.state = {
			inputId: 			this.props.inputId == undefined ? 'date' : this.props.inputId,
			inputClass: 	this.props.inputClass == undefined ? 'form-control input-sm' : this.props.inputClass,
			wrapperClass: this.props.wrapperClass == undefined ? 'input-group' : this.props.wrapperClass,
			value: 				this.props.value == undefined ? moment().startOf('month') : this.props.value,
			placeholder:	this.props.placeholder == undefined ? '' : this.props.placeholder,
			range: 				this.props.range == undefined ? {start: '2000-01-01', end: '2030-12-31'} : this.props.range
		}
		
		this.setDate = this.setData.bind(this);
		this.update = this.update.bind(this);
		
	}
	
	
	setData(props) {
		let _this = this;
		let state = this.state;
		
		state.value = props.value == undefined ? moment().startOf('month') : props.value;
		state.month = moment(state.value).format("MM");
		state.year = moment(state.value).format("YYYY");
		_this.setState(state);
	}
	
	
	update(e, type, value ) {
		let _this = this;
		let state = this.state;
		if(e){e.preventDefault(); e.stopPropagation();}
		
		state.month = this.refs['month'].value;
		state.year = this.refs['year'].value;
		
		state.value = state.year + "-" + state.month + "-01";
		state.date_start = state.year + "-" + state.month + "-01";
		state.date_end = moment( state.date_start ).endOf('month').format("YYYY-MM-DD");
		
		this.props.update(e, this.props.mode, {date_start: state.date_start, date_end: state.date_end } );
		
	}
	
	render() {
		let state = this.state;
		let year_start = parseInt( moment( state.range.start ).format("YYYY") );
		let year_end = parseInt( moment( state.range.end ).format("YYYY") ) + 1;
		
		return (
			<div className={state.wrapperClass} style={{width: '100%'}}>
				<div style={{display: 'inline-block', width: '200px'}}>
					<select ref="month" value={state.month} className="form-control" onChange={(e)=>this.update(e,'month')}>
						{_.range(1,13).map((m, j) => {
							let month = ( "0" + m ).slice(-2);
							return (<option value={month} key={j} >{Config.months[j]}</option>)
						})}
					</select> 
				</div>
				<div style={{display: 'inline-block', width: '100px'}}>
					<select ref="year" value={state.year} className="form-control" onChange={(e)=>this.update(e,'year')}>
						{_.range(year_start, year_end).map((y, j) => {
							return (<option value={y} key={j} >{y}</option>)
						})}
					</select> 
				</div>
			</div>
		);
	}
	
	componentDidMount() {		
		let _this = this;
		
		_this.setData(this.props);
		
		
	}
	
	componentWillUpdate(props) {
		let _this = this; let state = this.state;
		
		if( this.props.value != props.value ) {
			_this.setData( props );
			
		}
		
	}
	
	
	componentWillUnmount() {
		$( '#' + this.state.inputId ).datepicker('destroy');
	}
	
	
}
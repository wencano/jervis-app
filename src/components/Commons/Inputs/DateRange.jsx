import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';


export default class InputDateRange extends React.Component {
	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		this.state = {
			inputId: 			this.props.inputId == undefined ? 'daterange' : this.props.inputId,
			inputClass: 	this.props.inputClass == undefined ? 'form-control input-sm' : this.props.inputClass,
			wrapperClass: this.props.wrapperClass == undefined ? 'input-group' : this.props.wrapperClass,
			position: 		this.props.position == undefined ? 'left' : this.props.position,
			defaultText: 	this.props.defaultText == undefined ? false : this.props.defaultText,
			start: 				this.props.start == undefined ? moment().startOf('month') : this.props.start,
			end: 					this.props.end == undefined ? moment().endOf('month') : this.props.end,
			ranges:				this.props.ranges == undefined ? {} : this.props.ranges,
			icon:					this.props.icon == undefined ? false : this.props.icon,
			alwaysShowCalendars: 	this.props.alwaysShowCalendars == undefined ? true : this.props.alwaysShowCalendars
		}
		
		this.handleUpdate = this.handleUpdate.bind(this);
		this.getRanges = this.getRanges.bind(this);
		
	}
	
	handleUpdate(data) {
		this.props.update(null, 'daterange', data );
	}
	
	getRanges() {
		let _this = this;
		let state = this.state;
		
		// Default
		let defaultRanges = {
			'All Time' : [moment('2000-01-01'),moment('2030-12-31')],
			'Today'	: [moment(),moment()],
			'Yesterday' : [moment().subtract(1,'day'),moment().subtract(1,'day')],
			'This Month': [moment().startOf('month'), moment().endOf('month')],
			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
			'This Year': [moment().startOf('year'), moment().endOf('year')],
			'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
		}
		
		// Default Ranges
		let ranges = {};
		let rangeslist = "All Time,This Month,Last Month,This Year,Last Year";
		rangeslist.split(',').map((r)=>{
			ranges[r] = defaultRanges[r];
		});
		
		// Add
		if(state.ranges.add) {
			ranges = _.clone( defaultRanges );
		}
		
		return ranges;
		
	}
	
	render() {
		return (
			<div className={this.state.wrapperClass} style={{width: '100%'}}>
				{this.state.icon ? <div className="input-group-addon"><i className="fa fa-calendar"></i></div> : null}
				<input type="text" className={this.state.inputClass} id={this.state.inputId} />
			</div>
		);
	}
	
	componentDidMount() {
		
		let _this = this;
		$(function(){
			
			// Date Range
			$( '#' + _this.state.inputId ).daterangepicker({
					locale: {
						format: 'YYYY-MM-DD'
					},
          ranges: _this.getRanges(),
					alwaysShowCalendars: _this.state.alwaysShowCalendars,
          startDate: moment( _this.state.start ),
          endDate: moment( _this.state.end ),
					opens: _this.state.position,
					showDropdowns: true,
					autoUpdateInput: false
        },
        function (start, end) {
					let data = {start: start.format("YYYY-MM-DD"), end: end.format("YYYY-MM-DD")};
					if( data.start == '1970-01-01' ) $( '#' + _this.state.inputId ).val( 'All Time' );
					else $( '#' + _this.state.inputId ).val( 
								start.format('YYYY-MM-DD') + ' - ' + 
								end.format("YYYY-MM-DD")
							);
          _this.handleUpdate(data);
        }
			);
			
			if( _this.state.defaultText ) {
				$( '#' + _this.state.inputId ).val( _this.state.defaultText );
			}
			
			$('#'+_this.state.inputId).on('show.daterangepicker', function(ev, picker) {
				if( picker.startDate.format('YYYY-MM-DD') == '1970-01-01' || picker.endDate.format('YYYY-MM-DD') ) {
					
				}
			});
			
		});
	}
	
	
	componentWillUnmount() {
		$( '#' + this.state.inputId ).data('daterangepicker').remove();
	}
	
	
}
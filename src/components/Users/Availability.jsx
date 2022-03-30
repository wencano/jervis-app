import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import * as Helpers from '../../helpers';
import * as $api from '../../api';

import InputDate from '../Commons/Inputs/Date.jsx';

export default class TechAvailability extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			days: [
				{dow: 1, name: 'Mon'},
				{dow: 2, name: 'Tue' },
				{dow: 3, name: 'Wed'},
				{dow: 4, name: 'Thu'},
				{dow: 5, name: 'Fri'},
				{dow: 6, name: 'Sat'},
				{dow: 7, name: 'Sun'},
			],
			
			
			tech_sched_default: {
				id: 0,
				user_id: props.user_id || 0,
				date: '0000-00-00',
				dow: 0,
				t9_12pm: 1,			// 1 - available, 0 - unavailable
				t12_3pm: 1,
				t3_6pm: 1,
				t6_9pm: 1
			},


			availability: [],
			leaves: [],
			leavesOrig: []
			
		}
		
		this.toggleTimeslots = this.toggleTimeslots.bind(this);
		this.getData = this.getData.bind(this);
		this.addLeave = this.addLeave.bind(this);
		this.formChange = this.formChange.bind(this);
		this.changeDate = this.changeDate.bind(this);
		this.toggleLeaveForm = this.toggleLeaveForm.bind(this);
		this.saveLeave = this.saveLeave.bind(this);
		this.removeLeave = this.removeLeave.bind(this);
		
	}
	

	/**
	 * Toggle Timeslots
	 */
	toggleTimeslots(type, dow, slot) {
		let _this = this;
		let state = this.state;

		let sched = null;

		// Search Sched
		if( type == 'leaves' ) sched =	_.find( state[type], {date: dow} );
		else if ( type == 'availability' ) sched = _.find( state[type], a => ( parseInt( a.dow ) == dow ) );

		// Leave Sched does not exist
		if( type == 'leaves' && !sched ) return false; 

		if(type == 'availability' && !sched) {
			state.availability.push({...state.tech_sched_default, dow});
			sched = _.find( state.availability, a => ( parseInt( a.dow ) == dow )  );
		}

		sched[slot] = sched[slot] == 0 ? 1 : 0;
		_this.setState(state);

		
		if(type == 'availability') {
			// Send to DB
			$api.setLoading(true);
			Helpers.post( 'technicians/sched_upsert/', {session_key: $api.sessionKey(), tech_sched: sched}, res => {
				$api.setLoading(false);
				if(res && res.success && sched.id != parseInt( res.tech_sched.id )) {
					sched  = res.tech_sched;
					_this.setState(state);
				}
			});
		}
		
	}

	
	/**
	 * Get Data
	 */
	getData() {
		let _this = this;
		let props = this.props;
		let state = this.state;
		
		$api.setLoading(true);
		
		Helpers.post( 'technicians/sched/', {session_key: $api.sessionKey(), tech_id: props.user_id}, res => {
			$api.setLoading(false);
			if(res && res.success ) {
				state.availability = res.availability;
				state.leaves = _.cloneDeep( res.leaves );
				state.leavesOrig = _.cloneDeep( state.leaves );
				_this.setState(state);
			}
		});
		
		
	}
	
	
	
	/**
	 * Add Leave
	 */
	addLeave() {
		let _this = this;
		let state = this.state;
		let lastsched = _.first( state.leaves ) || {};
		
		let date = moment( lastsched.date || moment() ).format("YYYY-MM-DD");
		while( _.find(state.leaves, {date}) ) {
			date = moment(date).add(1, 'days').format("YYYY-MM-DD");
		}

		state.leaves.push({...state.tech_sched_default, date: date, 
			t9_12pm: 0, 
			t12_3pm: 0,
			t3_6pm: 0,
			t6_9pm: 0,
			edit: true
		});

		state.leaves = _.sortBy(state.leaves, ['date']);
		state.leaves = _.reverse( state.leaves );

		_this.setState(state);

	}
	

	/**
	 * Form Change
	 */
	formChange(e, sched, i ) {
		let _this = this;
		let state = this.state;
		let props = this.props;

		let {name,value} = e.target;

		state.leaves[i][name] = value;

		_this.setState(state);

	}


	/**
	 * Change Date
	 */
	changeDate(e, orig, i) {
		let _this = this;
		let state = this.state;
		let {name, value} = e.target;
		
		let date = moment(value).format("YYYY-MM-DD");

		let schedExists = _.find(state.leaves, {date});
		if( schedExists ) {
			alert('Date already exist!');
			return false;
		}

		else {
			state.leaves[i].date = date;
		}

		this.setState(state);
		
		return true;
	}


	/**
	 * Edit Leave
	 */
	toggleLeaveForm(i) {
		let state = this.state;
		let {leaves} = this.state;

		let leave = leaves[i];
		
		// Remove of No ID
		if( leave.edit && !leave.id && confirm('Warning! Closing the form will remove this item. Are you sure you want to continue?'))
			leaves.splice(i,1);

		// Revert to Original if changed
		else {
			
			leaves[i] = {...leave, edit: !leave.edit };
			let leaveOrig = _.find(state.leavesOrig, {id: leave.id });
			
			if( leave.edit && leaveOrig && JSON.stringify({...leaveOrig, edit: leaves[i].edit}) != JSON.stringify(leaves[i]) ) {
				
				if(confirm('Warning! Closing the form will revert the changes. Are you sure you want to continue?'))
					leaves[i] = leaveOrig;
				
				else 
					leaves[i] = {...leave};
				
			}

		}

		this.setState(this.state);
	}


	/**
	 * Save Leave
	 */
	saveLeave(i) {
		
		let _this = this;
		let state = this.state;
		let sched = this.state.leaves[i];

		// Send to DB
		$api.setLoading(true);
		Helpers.post( 'technicians/sched_upsert/', {session_key: $api.sessionKey(), tech_sched: sched, getlist: 1 }, res => {
			$api.setLoading(false);
			if(res && res.success ) {
				_this.state.leaves[i]  = res.tech_sched;
				_this.setState(_this.state);

				// Force Redownload
				state.availability = res.availability;
				state.leaves = _.cloneDeep( res.leaves );
				state.leavesOrig = _.cloneDeep( state.leaves );
				_this.setState(state);
			}
		});

	}


	/**
	 * Remove Leave
	 */
	removeLeave(i) {
		let _this = this;
		let state = this.state;

		if(confirm("Are you sure you want to remove this leave?")) {

			let sched = {...state.leaves[i]}; 
			
			// Send to DB
			$api.setLoading(true);
			Helpers.post( 'technicians/sched_remove/', {session_key: $api.sessionKey(), id: sched.id }, res => {
				$api.setLoading(false);
				
				if(res && res.success) {
					state.leaves.splice(i,1);
					_this.setState(state);
				}

			});

		}

	}
	
	
	/**
	 * Render
	 */
	render() {
		
		let props = this.props;
		let state = this.state;

		if( !props.user_id ) return (<div style={{maxWidth: 600 }} >User not found</div>);		

		return(
			<div style={{maxWidth: 600 }} >
				<h3>Weekly Unavailability Schedule</h3>
				<p>Toggle weekly unavailability schedule. You will be excluded from new project notifications if you are not available to all project dates and timeslot. Conflict projects will still be available in the list view. </p>
				<table className="table table-bordered ">
					<thead>
						<tr className="hidden-xs">
							<th style={{width: 80}}>Day</th>
							<th style={{width: 80, textAlign: 'center'}}>9-12pm</th>
							<th style={{width: 80, textAlign: 'center'}}>12-3pm</th>
							<th style={{width: 80, textAlign: 'center'}}>3-6pm</th>
							<th style={{width: 80, textAlign: 'center'}}>6-9pm</th>
						</tr>
						<tr className="visible-xs">
							<th style={{width: 80}}>Day</th>
							<th style={{width: 50, textAlign: 'center'}}>9-12 pm</th>
							<th style={{width: 50, textAlign: 'center'}}>12-3 pm</th>
							<th style={{width: 40, textAlign: 'center'}}>3-6 pm</th>
							<th style={{width: 40, textAlign: 'center'}}>6-9 pm</th>
						</tr>
					</thead>
					<tbody>
						
						{state.days.map( (d,i) => { 
							let sched = _.find(state.availability, a => ( parseInt( a.dow ) == d.dow ) );
							
							return (
								<tr key={i}>
									<td>{d.name}</td>
									<td onClick={()=>this.toggleTimeslots('availability', d.dow,'t9_12pm')} style={{textAlign: 'center', background: sched && !parseInt(sched.t9_12pm) ? '#f39c12' : 'none' }} ></td>
									<td onClick={()=>this.toggleTimeslots('availability', d.dow,'t12_3pm')} style={{textAlign: 'center', background: sched && !parseInt(sched.t12_3pm) ? '#f39c12' : 'none'}}></td>
									<td onClick={()=>this.toggleTimeslots('availability', d.dow,'t3_6pm')} style={{textAlign: 'center', background: sched && !parseInt(sched.t3_6pm) ? '#f39c12' : 'none'}}></td>
									<td onClick={()=>this.toggleTimeslots('availability', d.dow,'t6_9pm')} style={{textAlign: 'center', background: sched && !parseInt(sched.t6_9pm) ? '#f39c12' : 'none'}}></td>
								</tr>);
							})
						}
					</tbody>
				</table>
				<br /><br /><br />
				
				
				<h3>Leave Schedule <button className={ "btn btn-sm btn-default btn-flat "} onClick={(e)=>this.addLeave()} ><i className="fa fa-plus"></i> Add</button>&nbsp; </h3>
				<table className="table table-bordered table-striped">
					<thead>
						<tr className="hidden-xs">
							<th style={{width: 100}} >Date</th>
							<th style={{width: 50, textAlign: 'center'}}>9-12 pm</th>
							<th style={{width: 50, textAlign: 'center'}}>12-3 pm</th>
							<th style={{width: 50, textAlign: 'center'}}>3-6 pm</th>
							<th style={{width: 50, textAlign: 'center'}}>6-9 pm</th>
							<th style={{width: 'auto'}}>Purpose</th>
						</tr>
						<tr className="visible-xs">
							<th style={{width: 100}} >Date</th>
							<th style={{width: 50, textAlign: 'center'}}>9-12 pm</th>
							<th style={{width: 50, textAlign: 'center'}}>12-3 pm</th>
							<th style={{width: 40, textAlign: 'center'}}>3-6 pm</th>
							<th style={{width: 40, textAlign: 'center'}}>6-9 pm</th>
							<th style={{width: 'auto'}}>Purpose</th>
						</tr>
					</thead>
					<tbody>
						
						
						{state.leaves && state.leaves.length ? 
							state.leaves.map( (sched,i) => { 
								
								return ( 
									<tr key={i}>
										<td>
											{sched.edit ? 
												<InputDate className="form-control input-md" inputId={"schedule-item-"+i} value={moment(sched.date).format("YYYY-MM-DD")} onChange={(e)=>this.changeDate(e,sched,i)} name="date" icon={false} autoclose={true} revert={true} /> 
												: moment(sched.date).format("YYYY-MM-DD")
											}
										</td>
										<td onClick={()=>( sched.edit ? this.toggleTimeslots('leaves', sched.date,'t9_12pm') : null ) } style={{textAlign: 'center', background: sched && !parseInt(sched.t9_12pm) ? '#f39c12' : 'none'}}></td>
										<td onClick={()=>( sched.edit ? this.toggleTimeslots('leaves', sched.date,'t12_3pm') : null ) } style={{textAlign: 'center', background: sched && !parseInt(sched.t12_3pm) ? '#f39c12' : 'none'}}></td>
										<td onClick={()=>( sched.edit ? this.toggleTimeslots('leaves', sched.date,'t3_6pm') : null ) } style={{textAlign: 'center', background: sched && !parseInt(sched.t3_6pm) ? '#f39c12' : 'none'}}></td>
										<td onClick={()=>( sched.edit ? this.toggleTimeslots('leaves', sched.date,'t6_9pm') : null ) } style={{textAlign: 'center', background: sched && !parseInt(sched.t6_9pm) ? '#f39c12' : 'none'}}></td>
										<td style={{position: 'relative'}}>

											<div style={{position: 'absolute', top: 5, right: 5}}>
												{ sched.edit ? 
													<div className="btn-group">
														<button type="button" className="btn btn-flat btn-xs btn-success" onClick={e=>this.saveLeave(i)} style={{}}><i className="fa fa-save"></i></button>
														<button type="button" className="btn btn-flat btn-xs btn-default" onClick={e=>this.toggleLeaveForm(i)} style={{}}><i className="fa fa-close"></i></button>
													</div>
													: <div className="btn-group">
														<button type="button" className="btn btn-flat btn-xs btn-default" onClick={e=>this.toggleLeaveForm(i)} style={{}}><i className="fa fa-pencil"></i></button>
														<button type="button" className="btn btn-flat btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="true" style={{padding: "1px 2px"}} onClick={(e)=>Helpers.preventDefault(e)} >
															<span className="caret"></span>
														</button>
														<ul className="dropdown-menu dropdown-menu-right">
															<li className="separator"></li>
																<li><a href="javascript:;" onClick={e=>this.removeLeave(i)}>Delete</a></li>
														</ul>
													</div>
												}
											</div>
											

											{sched.edit ? 
												<textarea rows={1} type="text" className="form-control input-sm" value={sched.notes} onChange={(e)=>this.formChange(e,sched,i)} name="notes" style={{width: "calc(100% - 40px)"}}></textarea>
												: sched.notes
											}
											
										</td>
									</tr>
								)}
								) : 
							<tr>
								<td colSpan={6}>No leaves found.</td>
							</tr>
						}
						
					</tbody>
				</table>
				<br /><br /><br />
				
			</div>
		);
	}
	
	
	/**
	 * Get Data
	 */
	componentWillMount() {
		if(this.props.user_id) this.getData();
	}
	
	
	/**
	 * Component Will Receive Props
	 */
	componentWillReceiveProps( props ) {
		

	}
	
}
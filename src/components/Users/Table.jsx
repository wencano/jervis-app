import React from 'react';
import { Link } from 'react-router';


import * as Helpers from '../../helpers';
import * as _api from './api'; 

import Filters from '../../tmpl/Filters.jsx'; 
import LoadMore from '../Commons/LoadMore.jsx'; 
import SortIcon from '../Commons/SortIcon.jsx';
import Pagination from '../Commons/Pagination.jsx';
import moment from 'moment';

export default class UsersTable extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			selectAll: false,
			selecting: false,
			users: props.users || [],
			columns: props.columns || ['name', 'email', 'status', 'location_name', 'notes']
		}
		
		this.filterChange = this.filterChange.bind(this);
		this.sortChange = this.sortChange.bind(this);
		
		this.toggleSelect = this.toggleSelect.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.selectAll = this.selectAll.bind(this);
		this.deleteSelected = this.deleteSelected.bind(this);
		
	}
	
	/**
	 * Set Filter
	 */
	filterChange(e) {
		
		let props = this.props; 
		let component = props.component; 
		
		let filters = props.filters;
		let {name, value} = e.target;
		
		filters[ name ] = value; 
		
		props.setFilters( filters, component );
		
		// Check length
		if( value.length > 0 ) {
			if( ['name', 'email'].inArray( name ) && value.length < 3 ) return false; 
		}
		
		props.getList( component );
		
	}
	
	
	/**
	 * Set Sort
	 */
	sortChange(column, dir) {
		
		let props = this.props; 
		let component = props.component; 
		
		let sort = props.sort;
		
		if( sort.by == column ) sort.dir = sort.dir == 'asc' ? 'desc' : 'asc';
		else sort = { by: column, dir: dir || 'asc' };
		
		props.setSort( sort, component );
		props.getList( component );
		
	}
	
	
	toggleSelect(e) {
		let state = this.state;
		e.preventDefault(); e.stopPropagation();
		
		state.selectAll = false;
		state.users = state.users.map( (user,i) =>({...user, selected: state.selectAll} ));
		state.selecting = !state.selecting; 
		
		this.setState(state);
	}
	
	handleClick(user, i) {
		let state = this.state;
		
		if( !state.selecting ) {
			Helpers.push( 'users/' + user.id + "/");
			return false; 
		}
		
		else {
			state.users[i] = {...state.users[i], selected: !user.selected };
			this.setState(state);
		}
		
	}
	
	
	selectAll() {
		let state = this.state;
		
		state.selectAll = !state.selectAll;
		state.users = state.users.map( (user,i) =>({...user, selected: state.selectAll} ));
		this.setState(state);
	}
	
	
	deleteSelected() {
		let state = this.state;
		let select_ids = [];
		state.users.map( (user,i) => {
			if(user.selected) select_ids.push(user.id);
		});
		
		if(select_ids.length) {
			if(confirm('Are you sure you want to delete the selected items?\n' + select_ids.join(', ') )) {
				alert('Deleted');
				this.toggleSelect();
			}
		}
		
	}
	
	render() {
		let props = this.props;
		let state = this.state; 
		
		let users = this.state.users; 
		
		let newusers = _.filter(users, u => u.status == -1 );
		users = _.filter(users, u=> u.status > -1);
		
		let colLocation = state.columns.indexOf('location_name') < 0 ? 'hide' : 'show';
		let colTech 	= state.columns.indexOf('tech_name') < 0 ? 'hide' : 'show';
		let colStatus = state.columns.indexOf('status') < 0 ? 'hide' : 'show';
		
		let filters = props.filters || {};
		let filterParams = props.filterParams || {};

		console.log("NEW USERS ", newusers);
		
		
		return (
			<div className="users-table">
				<div className="row table-row table-header-row ">
					<div className="col-sm-3 hidden-xs" onClick={(e)=>this.sortChange( 'name' )} style={{cursor: 'pointer'}}>
						<SortIcon sort={props.sort} column={'name'} />
						<b>Name / Contact</b>
					</div>
					<div className="col-sm-1 hidden-xs" onClick={(e)=>this.sortChange( 'status' )} style={{cursor: 'pointer'}}>
						<SortIcon sort={props.sort} column={'status'} />
						<b>Status</b>
					</div>
					
					<div className="col-sm-1 hidden-xs" onClick={(e)=>this.sortChange( 'hourly_rate' )} style={{cursor: 'pointer'}}>
						<SortIcon sort={props.sort} column={'hourly_rate'} />
						<b>Rate</b>
					</div>

					{ filters.type == 'technician' ? 
						<div className="col-sm-1 hidden-xs" onClick={(e)=>this.sortChange( 'last_completed_date' )} style={{cursor: 'pointer'}}>
							<SortIcon sort={props.sort} column={'last_completed_date'} />
							<b>Completed</b>
						</div> : null 
					}
					
					<div className="col-sm-1 hidden-xs text-center" onClick={(e)=>this.sortChange( 'num_projects' )} style={{cursor: 'pointer'}}>
						<SortIcon sort={props.sort} column={'num_projects'} />
						<b>Projects</b>
					</div>
					
					{ colLocation == 'show' ?
						<div className={ "col-sm-2 hidden-xs " + ( props.showLocations === false ? 'hide' : '')} >
							<b>Locations</b>
						</div> : null
					}
				
					<div className={ (filters.type == 'technician' ? "col-sm-3 " : "col-sm-4 ") + " hidden-xs"}>
						<b>Categories</b> / <b>Notes</b></div>
					<div className="clearfix"></div>

				</div>
				
				
				{/** Filters */}
				{ !props.hideFilters && !state.selecting ?
					<Filters className="row table-row filter-row bg-gray" >
						<div className="col-sm-3">
							<p className="visible-xs filter-label"><b>Name / Contact: </b></p>
							<input type="text" className="form-control input-sm" value={ filters.name} onChange={this.filterChange} name="name" placeholder="Name"/>
						</div>
						
						<div className="col-sm-1 ">
							<p className="visible-xs filter-label"><b>Status: </b></p>
							<select className="form-control users-select-type input-sm" onChange={this.filterChange} name="status">
								<option value="">All</option>
								<option value="1">ACTIVE</option>
								<option value="0">INACTIVE</option>
							</select>
						</div>
						
						<div className="col-sm-1">
							
						</div>
						
						<div className="col-sm-1 ">
							
						</div>
						
						{ colLocation == 'show' ?
							<div className={"col-sm-2 " + ( props.showLocations === false ? 'hide' : '') }>
								<p className="visible-xs filter-label "><b>Locations: </b></p>
								<select className="form-control users-select-location input-sm" onChange={this.filterChange} name="location_id" >
									<option value="">All</option>
									{filterParams.locations && filterParams.locations.length ? filterParams.locations.map( (loc, i) => (
										<option key={i} value={loc.id}>{loc.city}, {loc.state}</option>
									)) : null}
								</select>
							</div> : null
						}
						
						<div className="col-sm-4">
							<p className="visible-xs filter-label"><b>Categories: </b></p>
							<div className="col-sm-8">
								<select className="form-control input-sm" onChange={this.filterChange} name="category_id" >
									<option value="">All</option>
									{filterParams.categories && filterParams.categories.length ? filterParams.categories.map( (cat, i) => (
										<option key={i} value={cat.id}>{cat.name}</option>
									)) : null}
								</select>
							</div>
							{/** 
							<Select2 id="categories" 
								data={
									props.filterParams.categories && props.filterParams.categories.length ? _.map( props.filterParams.categories, cat => {
										return {id: cat.id, text: cat.name }
									} ) : [] }
								placeholder="Select Categories"
								onChange={(e)=>this.filterChange(e)} 
								name="category_id"
							/> */}
						</div>
						
						<div className="clearfix"></div>
					</Filters>
					: null
				}
				
				{/** Selecting */}
				{ state.selecting ? 
						<div className="row table-row bg-gray text-center" style={{ padding: 10 }}>
							<button type="button" className="btn btn-sm btn-flat btn-default pull-right" onClick={()=>this.selectAll()} >{state.selectAll ? "Unselect" : 'Select'} All</button>
							<button type="button" className="btn btn-sm btn-flat btn-default pull-left" onClick={()=>this.setState({...this.state, selecting: false, users: props.users})} >Cancel</button>
							
							<button type="button" className="btn btn-sm btn-flat btn-danger" onClick={()=>this.deleteSelected()}><i className="fa fa-trash"></i> Remove</button>
							
						</div>
					: null
				}
				
				{/** NEW USERS */}
				{ newusers && newusers.length > 0 ? newusers.map((user, i) => {
					
					let userLocations = _.map(user.locations, l => l.city ).join(', ');
					
					return (
					<div className="row table-row table-body-row " key={i} onClick={()=>this.handleClick(user,i)} style={{cursor: 'pointer', position: 'relative'}}>
						<div className="col-sm-3">
							<Link to={Config.root + 'users/' + user.id + '/'} onClick={(e)=>{ e.stopPropagation(); }}><b>{user.name}</b></Link>< br />
							<span className="visible-xs" style={{color: '#999'}}>{user.status == 0 ? <span>INACTIVE &bull; < br /> </span> : null } </span>
							<span className="">{user.email}< br /></span>
							<span className="">{user.phone}</span>
						</div>
						
						<div className="col-sm-1 hidden-xs">
							{ user.status == -1 ? <span className="label label-xs label-warning">NEW</span> : '' }
							{ user.status == 0 ? <span className="label label-xs label-default">INACTIVE</span> : '' }
							{ user.status == 1 ? <span className="label label-xs label-success">ACTIVE</span> : '' }
						</div>
						
						<div className="col-sm-1 col-xs-12">
							${ ( user.hourly_rate || 0 ).toFloat().accounting() }
						</div>

						{!filters.type || filters.type == 'technician' ? 
							<div className="col-sm-1 hidden-xs text-center">
								
							</div> : null 
						}


						<div className="col-sm-1 hidden-xs text-center">
							{ user.num_projects }
						</div>
						
						
						{ colLocation == 'show' ?
							<div className={"col-sm-2 hidden-xs " + ( props.showLocations === false ? 'hide' : '') } style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={userLocations} >
								{user.locations ? user.locations.length : 0} - { userLocations }
							</div> : null 
						}
						
						<div className={(!filters.type || filters.type == 'technician' ? "col-sm-3 " : "col-sm-4 ") + " hidden-xs"} >
							{ user.categories && user.categories.length ? user.categories.map( (cat, i) => (
								<span key={i} className="label label-primary label-sm" style={{ float: 'left', margin: '0 3px 5px 0', fontSize: 13, fontWeight: 'normal'}} title={cat.name}>{cat.code}</span> ) ) : 
								null
							}
							{user.notes}
						</div>
						<span style={{position: 'absolute', top: '50%', right: 15, marginTop: '-10px' }}>
							{state.selecting ? 
								<input type="checkbox" checked={user.selected}  /> : 
								<Link to={Config.root + 'users/' + user.id + '/'} title="Open"><i className="fa  fa-chevron-right"></i></Link>
							}
						</span>
						<div className="clearfix"></div>
					</div>
					);
				}) : 
					null
				}
				
				
				{/** REGULAR USERS */}
				{ users && users.length > 0 ? users.map((user, i) => {
					
					let userLocations = _.map(user.locations, l => l.city ).join(', ');
					
					return (
					<div className="row table-row table-body-row " key={i} onClick={()=>this.handleClick(user,i)} style={{cursor: 'pointer', position: 'relative'}}>
						<div className="col-sm-3">
							<Link to={Config.root + 'users/' + user.id + '/'}><b>{user.name}</b></Link>< br />
							<span className="visible-xs" style={{color: '#999'}}>{user.status == 0 ? <span>INACTIVE &bull; < br /> </span> : null } </span>
							<span className="">{user.email}< br /></span>
							<span className="">{user.phone}</span>
						</div>
						
						<div className="col-sm-1 hidden-xs">
							{ user.status == 0 ? <span className="label label-xs label-default">INACTIVE</span> : '' }
							{ user.status == 1 ? <span className="label label-xs label-success">ACTIVE</span> : '' }
						</div>
						
						<div className="col-sm-1 col-xs-12">
							${ ( user.hourly_rate || 0 ).toFloat().accounting() }
						</div>
						
						{ !filters.type || filters.type == 'technician' ? 
							<div className="col-sm-1 hidden-xs text-center">
								{ user.last_completed_date && !['','0000-00-00','0000-00-00 00:00:00'].includes(user.last_completed_date) ? 
									moment( user.last_completed_date ).format("YYYY-MM-DD") : ''
								}
							</div> : null 
						}

						<div className="col-sm-1 hidden-xs text-center">
							{ user.num_projects }
						</div>
						
						{ colLocation == 'show' ?
							<div className={"col-sm-2 hidden-xs " + ( props.showLocations === false ? 'hide' : '') } style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={userLocations} >
								{user.locations ? user.locations.length : 0} - { userLocations }
							</div> : null 
						}
						
						<div className={(!filters.type || filters.type == 'technician' ? "col-sm-3 " : "col-sm-4 ") + " hidden-xs"} >
							{ user.categories && user.categories.length ? user.categories.map( (cat, i) => (
								<span key={i} className="label label-primary label-sm" style={{ float: 'left', margin: '0 3px 5px 0', fontSize: 13, fontWeight: 'normal'}} title={cat.name}>{cat.code}</span> ) ) : 
								null
							}
							{user.notes}
						</div>
						<span style={{position: 'absolute', top: '50%', right: 15, marginTop: '-10px' }}>
							{state.selecting ? 
								<input type="checkbox" checked={user.selected}  /> : 
								<Link to={Config.root + 'users/' + user.id + '/'} title="Open"><i className="fa  fa-chevron-right"></i></Link>
							}
						</span>
						<div className="clearfix"></div>
					</div>
					);
				}) : 
					<div className="row table-row " >
						<div className="col-sm-12">
							No users found.
						</div>
						<div className="clearfix"></div>
					</div>
				}
				
				
				{ props.users && props.users.length ? 
					<div className="row table-row bg-gray" >
						<div className="col-sm-12">
							<div className="pull-right">
								<LoadMore page={props.page} setPage={props.setPage} getList={props.getList} className="btn btn-primary btn-md btn-flat visible-xs" component={props.component}/>
								<Pagination page={props.page} setPage={props.setPage} getList={props.getList} className="hidden-xs" component={props.component}/>
							</div>
							<strong>{props.users.length} of {props.page.total} items</strong>
						</div>
					</div> : null 
				}
					
			</div>
		);
		
	}
	
	componentDidUpdate() {
		let _this = this;
		$(()=>{
			
			if($('div.table-body-row').length && !this.state.selecting ) {
			
				$('div.table-body-row').hammer().off('press');
				$('div.table-body-row').hammer().bind('press', (e)=> _this.toggleSelect(e) );
			}
		});
		
	}
	
	componentWillReceiveProps(props) {
		let state = this.state;
		if(  !state.selecting && JSON.stringify( this.props ) != JSON.stringify(props)) {
			if(props.users) {
				state.users = [...props.users];
				this.setState(state);
			}
		}
	}
	
	componentWillUnmount() {
		if($('div.table-body-row').length ) $('div.table-body-row').hammer().off('press');
	}
	
}

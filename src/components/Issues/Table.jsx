import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import * as Helpers from '../../helpers';
import * as _api from './api'; 
import Filters from '../../tmpl/Filters.jsx'; 
import LoadMore from '../Commons/LoadMore.jsx'; 
import SortIcon from '../Commons/SortIcon.jsx';
import Pagination from '../Commons/Pagination.jsx';
import ButtonDropdown from '../Commons/Inputs/ButtonDropdown.jsx'; 
import * as _store from './store';
import ModalForm from './ModalForm.jsx';


/**
 * Table View
 */
export default class IssuesTable extends React.Component {
	
	
	/**
	 * Constructor
	 */
	constructor(props) {
		super(props);
		
		this.state = {
      issues: props.issues,
			issues_updated: [],				// [{index, issue}]
			selectAll: false,
			selecting: false,
			selected: 0,
			columns: props.columns || ['id', 'issue', 'assignee', 'followup', 'status', 'done' ]
		}
		this.filterChange = this.filterChange.bind(this);
		this.sortChange = this.sortChange.bind(this);
		this.toggleSelect = this.toggleSelect.bind(this);
		this.selectAll = this.selectAll.bind(this);
		this.deleteSelected = this.deleteSelected.bind(this);

		this.showIssue = this.showIssue.bind(this);
		this.closeIssue = this.closeIssue.bind(this);
	}
	
	
	/**
	 * Set Filter
	 */
	filterChange(e) {
		
		let props = this.props; 
		let component = props.component; 
		
		console.log(props.filters);
		let filters = component ? props[component].filters : props.filters;
		let {name, value} = e.target;
		
		filters[ name ] = value; 
		
		props.setFilters( filters, component );
		
		// Check length
		if( value.length > 0 ) {
			if( ['issue'].inArray( name ) && value.length < 3 ) return false; 
		}
		
		props.getList( component );
		
	}
	
	
	/**
	 * Set Sort
	 */
	sortChange(column, dir) {
		
		let props = this.props; 
		let component = props.component; 

		let sort = component ? props[component].sort : props.sort;
		
		if( sort.by == column ) sort.dir = sort.dir == 'asc' ? 'desc' : 'asc';
		else sort = { by: column, dir: dir || 'asc' };
		
		props.setSort( sort, component );
		props.getList( component );
		
	}
	
	
	/**
	 * Show/Hide Selection
	 */
	toggleSelect(e) {
		let state = this.state;
		if(e) { e.preventDefault(); e.stopPropagation(); }
		
		state.selectAll = false;
		state.issues = state.issues.map( (issue,i) =>({...issue, selected: state.selectAll} ));
		state.selecting = !state.selecting; 
		
		this.setState(state);
	}


	
	/**
	 * Force Select/Unselect 
	 */
	selectAll() {
		let state = this.state;
		
		state.selectAll = !state.selectAll;
		state.issues = state.issues.map( (issue,i) =>({...issue, selected: state.selectAll} ));
		this.setState(state);
	}
	
	
	/**
	 * Delete Selected 
	 */
	deleteSelected() {
		let state = this.state;
		let select_ids = [];
		
		state.issues.map( (issue,i) => {
			if(issue.selected) select_ids.push(issue.id);
		});
		
		if(select_ids.length) {
			_api.remove(select_ids, () => this.toggleSelect() );
		}
		
	}

	
	/**
	 * Show Issue
	 */
	showIssue(issue, e, trigger) {
		let state = this.state;
		let props = this.props;
		
		if( ( trigger == 'div' && !AppHelpers.screenIs('xs') ) || trigger == 'a' && AppHelpers.screenIs('xs') ) return false;

		this.setState({...state, selected: issue.id});
		this.props.setModal(ModalForm, {id: 'modal-issue', className: 'modal right fade', issue, closeIssue: this.closeIssue, getList: props.getList});
		
	}
	closeIssue() { let _this = this; _this.setState({..._this.state, selected: 0 }); }



	
	
	/**
	 * Render
	 */
	render() {
		let _this = this;
		let props = this.props;
		let state = this.state; 
		let issues = this.state.issues;
    let tab = props.route.tab; 


		return (

			<div className="issues-table">

				<div className="row table-row table-header-row hidden-xs">
				
				<div className="col-sm-1 col-xs-3" onClick={(e)=>this.sortChange( 'id' )} style={{cursor: 'pointer'}} >
						<SortIcon sort={props.sort} column={'id'} />
						<b>Issue #</b>
					</div>

					<div className="col-sm-3 col-xs-9" onClick={(e)=>this.sortChange( 'issue' )} style={{cursor: 'pointer'}} >
						<SortIcon sort={props.sort} column={'issue'} />
						<b>TItle/Description</b>
					</div>
					
					<div className="col-sm-1 hidden-xs" onClick={(e)=>this.sortChange( 'assignee' )} style={{cursor: 'pointer'}} >
						<SortIcon sort={props.sort} column={'assignee'} />
						<b>Assignee</b>
					</div>

					<div className="col-sm-1 hidden-xs" onClick={(e)=>this.sortChange( 'followup' )} style={{cursor: 'pointer'}} >
						<SortIcon sort={props.sort} column={'followup'} />
						<b>Est. Delivery Date</b>
					</div>

					<div className="col-xs-2 hidden-xs" onClick={(e)=>this.sortChange( 'status' )} style={{cursor: 'pointer'}} >
						<SortIcon sort={props.sort} column={'status'} />
						<b>Status</b>
					</div>

					<div className="col-sm-4 hidden-xs" onClick={(e)=>this.sortChange( 'done' )} style={{cursor: 'pointer'}} >
						<SortIcon sort={props.sort} column={'done'} />
						<b>Done</b>
					</div>

					<div className="clearfix"></div>
				</div>
				
				
				{/** Filters */}
				{!state.selecting && !props.hideFilters ?
					<Filters className="row table-row filter-row bg-gray" >

						<div className="col-sm-1">
              <p className="visible-xs filter-label"><b>ID: </b></p>
              <input name="id" type="text" className="form-control" value={props.filters.id} onChange={this.filterChange} placeholder="Version ID..." />
						</div>

						<div className="col-sm-3">
              <p className="visible-xs filter-label"><b>Description: </b></p>
              <input name="title" type="text" className="form-control" value={props.filters.title} onChange={this.filterChange} placeholder="Issue..." />
						</div>

						<div className="col-sm-1">
              <p className="visible-xs filter-label"><b>Assignee: </b></p>
              <input name="assigned_to" type="text" className="form-control" value={props.filters.assigned_to} onChange={this.filterChange} placeholder="Assignee..." />
						</div>

						<div className="col-sm-1">
              
						</div>

						<div className="col-sm-2 ">
							<p className="visible-xs filter-label"><b>Status: </b></p>
							<select className="form-control users-select-type" onChange={this.filterChange} name="status">
								<option value="">All</option>
								<option value="DESIGNED">DESIGNED</option>
								<option value="NOTSTARTED">NOT STARTED</option>
							</select>
						</div>

						<div className="col-sm-4">
              <p className="visible-xs filter-label"><b>Done: </b></p>
              <input name="done" type="text" className="form-control" value={props.filters.done} onChange={this.filterChange} placeholder="Done..." />
						</div>

						<div className="clearfix"></div>
					</Filters>
					: null
				}
				
				
				{/** Selecting */}
				{ state.selecting ? 
						<div className="row table-row bg-gray text-center" style={{ padding: 10 }}>
							<button type="button" className="btn btn-sm btn-flat btn-default pull-right" onClick={()=>this.selectAll()} >Select All</button>
							<button type="button" className="btn btn-sm btn-flat btn-default pull-left" onClick={()=>this.setState({...this.state, selecting: false, issues: props.issues})} >Cancel</button>
							
							<button type="button" className="btn btn-sm btn-flat btn-danger" onClick={()=>this.deleteSelected()}><i className="fa fa-trash"></i> Remove</button>
							
						</div>
					: null
        }

        {issues && issues.length ? issues.map((issue, i) => {
          return (
            
              <div className={"row table-row table-body-row "+ (state.selected==issue.id? 'bg-info': '')} key={i} style={{position: 'relative'}}>
  
                <div className={"col-sm-1 col-xs-3 text-left" }>
									<div className="visible-xs">
										<span className="label label-xs label-warning">{issue.status.toUpperCase()}</span>
									</div>
									{issue.issue_id}
                </div>
  
                <div className="col-sm-3 col-xs-8" style={{textOverflow: "ellipsis"}} onClick={(e)=>this.showIssue(issue, e, 'div' )}>
                  <a href="javascript:;" onClick={(e)=>{ this.showIssue(issue,e, 'a'); }} >
										<b>{issue.title}</b><br/>
										{issue.description}<br/>
                  </a>
                </div>
  
                <div className={"col-sm-1 hidden-xs" }>
                  {issue.assigned_to}
                </div>

								<div className={"col-sm-1 hidden-xs" }>
                 
                </div>

								<div className={"col-xs-2 hidden-xs" }>
                  {issue.status}
                </div>

								<div className={"col-sm-4 hidden-xs" }>
									{issue.done}<br />
									{issue.next_steps}
                </div>
  
                <span style={{position: 'absolute', top: '50%', right: 15, marginTop: '-10px' }}>
                  {state.selecting ? 
                    <input type="checkbox" checked={issue.selected}  /> : 
                    <Link to={Config.root + 'issues/' + issue.id + '/'} title="Open"></Link>
                  }
                </span>
                <div className="clearfix"></div>
              </div>
            );
          }) : 
            <div className="row table-row " >
              <div className="col-sm-12">
                No issues found.
              </div>
              <div className="clearfix"></div>
            </div>
         }
        </div>
    )
        
	}
	
	
	componentDidUpdate() {
		let _this = this;
		// $(()=>{
			// if($('div.table-body-row').length && !this.state.selecting ) {
				// $('div.table-body-row').hammer().off('press');
				// $('div.table-body-row').hammer().bind('press', (e)=> _this.toggleSelect(e) );
			// }
		// });
	}
	
	componentWillReceiveProps(props) {
		let state = this.state;
		if(  !state.selecting && JSON.stringify( this.props ) != JSON.stringify(props)) {
			state.issues = [...props.issues];
			this.setState(state);
		}
	}
	
	componentWillUnmount() {
		//f($('div.table-body-row').length ) $('div.table-body-row').hammer().off('press');
	}
	
	
}
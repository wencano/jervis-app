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


/**
 * Table View
 */
export default class ProjectsTable extends React.Component {
	
	
	/**
	 * Constructor
	 */
	constructor(props) {
		super(props);
		
		this.state = {
      projects: props.projects,
			projects_updated: [],				// [{index, project}]
			selectAll: false,
			selecting: false,
			columns: props.columns || ['id', 'customer_name', 'title' ]
		}
		this.filterChange = this.filterChange.bind(this);
		this.sortChange = this.sortChange.bind(this);
		this.toggleSelect = this.toggleSelect.bind(this);
		this.selectAll = this.selectAll.bind(this);
		this.deleteSelected = this.deleteSelected.bind(this);
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
			if( ['project'].inArray( name ) && value.length < 3 ) return false; 
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
		state.projects = state.projects.map( (project,i) =>({...project, selected: state.selectAll} ));
		state.selecting = !state.selecting; 
		
		this.setState(state);
	}


	
	/**
	 * Force Select/Unselect 
	 */
	selectAll() {
		let state = this.state;
		
		state.selectAll = !state.selectAll;
		state.projects = state.projects.map( (project,i) =>({...project, selected: state.selectAll} ));
		this.setState(state);
	}
	
	
	/**
	 * Delete Selected 
	 */
	deleteSelected() {
		let state = this.state;
		let select_ids = [];
		
		state.projects.map( (project,i) => {
			if(project.selected) select_ids.push(project.id);
		});
		
		if(select_ids.length) {
			_api.remove(select_ids, () => this.toggleSelect() );
		}
		
	}

		/**
	 * Handle Item Click
	 */
	handleClick(project, i) {
		let state = this.state;
		
		if( !state.selecting ) {
			Helpers.push( 'projects/' + project.id + "/");
			return false; 
		}
	}
	
	
	/**
	 * Render
	 */
	render() {
		let _this = this;
		let props = this.props;
		let state = this.state; 
		let projects = this.state.projects;
    let tab = props.route.tab; 


		return (
			<div className="projects-table">
				<div className="row table-row table-header-row hidden-xs">
				
				<div className="col-sm-1" onClick={(e)=>this.sortChange( 'id' )} style={{cursor: 'pointer'}} >
						<SortIcon sort={props.sort} column={'id'} />
						<b>ID	</b>
					</div>

					<div className="col-sm-3 hidden-xs" onClick={(e)=>this.sortChange( 'customer_name' )} style={{cursor: 'pointer'}} >
						<SortIcon sort={props.sort} column={'customer_name'} />
						<b>Customer Name</b>
					</div>
					
					<div className="col-sm-3 hidden-xs" onClick={(e)=>this.sortChange( 'title' )} style={{cursor: 'pointer'}} >
						<SortIcon sort={props.sort} column={'title'} />
						<b>Title</b>
					</div>

					<div className="clearfix"></div>
				</div>
				
				
				{/** Filters */}
				{!state.selecting && !props.hideFilters ?
					<Filters className="row table-row filter-row bg-gray" >

						<div className="col-sm-3">
              <p className="visible-xs filter-label"><b>Customer Name: </b></p>
              <input name="customer_name" type="text" className="form-control" value={props.filters.customer_name} onChange={this.filterChange} placeholder="Customer Name..." />
						</div>

						<div className="col-sm-3">
              <p className="visible-xs filter-label"><b>Title: </b></p>
              <input name="title" type="text" className="form-control" value={props.filters.title} onChange={this.filterChange} placeholder="Title..." />
						</div>

						<div className="clearfix"></div>
					</Filters>
					: null
				}
				
				
				{/** Selecting */}
				{ state.selecting ? 
						<div className="row table-row bg-gray text-center" style={{ padding: 10 }}>
							<button type="button" className="btn btn-sm btn-flat btn-default pull-right" onClick={()=>this.selectAll()} >Select All</button>
							<button type="button" className="btn btn-sm btn-flat btn-default pull-left" onClick={()=>this.setState({...this.state, selecting: false, projects: props.projects})} >Cancel</button>
							
							<button type="button" className="btn btn-sm btn-flat btn-danger" onClick={()=>this.deleteSelected()}><i className="fa fa-trash"></i> Remove</button>
							
						</div>
					: null
        }

        {projects && projects.length ? projects.map((project, i) => {
          return (
            
              <div className="row table-row table-body-row " key={i} style={{position: 'relative'}}>
  
                <div className="col-sm-3 hidden-xs">
                  <Link to={Config.root + "projects/" + project.id + "/"}>
										<b>{project.customer_name}</b>
                  </Link>
                </div>
  
                <div className={"col-sm-3 hidden-xs" }>
									<Link to={Config.root + "projects/" + project.id + "/"}>
										<b>{project.title}</b>
									</Link>
                </div>
  
                <span style={{position: 'absolute', top: '50%', right: 15, marginTop: '-10px' }}>
                  {state.selecting ? 
                    <input type="checkbox" checked={project.selected}  /> : 
                    <Link to={Config.root + 'projects/' + project.id + '/'} title="Open"></Link>
                  }
                </span>
                <div className="clearfix"></div>
              </div>
            );
          }) : 
            <div className="row table-row " >
              <div className="col-sm-12">
                No projects found.
              </div>
              <div className="clearfix"></div>
            </div>
         }
        </div>
    )
        
	}
	
	
	componentDidUpdate() {
		let _this = this;
		
	}
	
	componentWillReceiveProps(props) {
		let state = this.state;
		if(  !state.selecting && JSON.stringify( this.props ) != JSON.stringify(props)) {
			state.projects = [...props.projects];
			this.setState(state);
		}
	}
	
	componentWillUnmount() {
		
	}
	
	
}
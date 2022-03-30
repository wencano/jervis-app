import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';

export default class Pagination extends React.Component {
	
	/**
	 * Constructor
	 */
	constructor(props) {
		super(props);
		
		this.pageChange = this.pageChange.bind(this);
		this.pageTo = this.pageTo.bind(this);
		
	}
	
	
	/**
	 * Set Pagination
	 */
	pageChange(e) {
		
		let props = this.props; 
		let component = props.component; 
		
		let page = props.page;
		let { name, value } = e.target;

		page[name] = value;
		
		if(name != 'current' ) page.current = 0;
		
		props.setPage( page, component );
		props.getList( component );
		
	}
	
	
	/**
	 * Page To
	 */
	pageTo( to ) {
		let props = this.props;
		let component = props.component; 
		
		let page = props.page;
		let orig = _.cloneDeep( page );
		
		if( to == 'next' && page.current < ( page.pages - 1 ) ) page.current++;
		else if ( to == 'prev' && page.current > 0 ) page.current--;
		else if( typeof to === 'numeric' ) page.current = to;
		
		if( JSON.stringify( orig ) != JSON.stringify( page ) ) {
			props.setPage( page, component );
			props.getList( component );
		}
		
	}
	
	
	/**
	 * Render
	 */
	render() {
		let props = this.props;
		
		return (
			<div className={props.className || ''} style={ props.style || {padding: '3px'}} >
			
				<div className="pull-left" style={{lineHeight: '18px', padding: '5px 10px', borderRight: '1px solid #ccc' }}>
					<select value={props.page.size} onChange={this.pageChange} name="size" >
						<option value="0">All</option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="25">25</option>
						<option value="50">50</option>
						<option value="100">100</option>
					</select>
				</div>
				
				<div className="pull-left" style={{lineHeight: '18px', padding: '5px 10px'}}>
					<span>
						{props.page.pages > 1 ? 
							<select value={props.page.current} onChange={this.pageChange} name="current">
								{_.range(0,props.page.pages).map((i)=>(
									<option value={i} key={i}>{ 
											i*props.page.size + 1
										}-{ 
											i == props.page.pages-1 ? props.page.total : ( (i+1) * props.page.size ) 
									}</option>
								))}
							</select> : 
							<span>
								<b>{ props.page.total == 0 ? 0 : "1-" + props.page.total}</b>
							</span>
						} of <b>{props.page.total.accounting().replace(".00", "")}</b>
					</span>
				</div>
			
				<ul className="pagination pagination-flat pagination-sm no-margin pull-left" style={{}} >
					<li className={ props.page.current == 0 || props.page.size == 0 ? "disabled text-gray" : ""} onClick={(e)=>this.pageTo('prev')} >
						<a href="javascript:0;"><i className="fa fa-chevron-left"></i></a>
					</li>
					<li className={ props.page.current >= props.page.pages-1 || props.page.size == 0 ? "disabled text-gray" : ""} onClick={(e)=>this.pageTo('next')}>
						<a href="javascript:0;"><i className="fa fa-chevron-right"></i></a>
					</li>
				</ul>
				
			</div>
		);
	}
	
	
	componentWillUpdate(props) {
		return JSON.stringify( this.props ) !== JSON.stringify(props);
	}
		
}
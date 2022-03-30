import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';

const Pagination = (props) => {
	return (
			<div className="">
			
				<div className="pull-left" style={{lineHeight: '18px', padding: '5px 10px', borderRight: '1px solid #ccc' }}>
					<select value={props.page.size} onChange={props.update} name="size" >
						<option value="0">All</option>
						<option value="10">10</option>
						<option value="25">25</option>
						<option value="50">50</option>
						<option value="100">100</option>
					</select>
				</div>
				
				<div className="pull-left" style={{lineHeight: '18px', padding: '5px 10px'}}>
					<span>
						{props.page.pages > 1 ? 
							<select value={props.page.current} onChange={props.update} name="current">
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
					<li className={ props.page.current == 0 || props.page.size == 0 ? "disabled text-gray" : ""} onClick={props.prev} >
						<a href="javascript:0;"><i className="fa fa-chevron-left"></i></a>
					</li>
					<li className={ props.page.current >= props.page.pages-1 || props.page.size == 0 ? "disabled text-gray" : ""} onClick={props.next}>
						<a href="javascript:0;"><i className="fa fa-chevron-right"></i></a>
					</li>
				</ul>
				
			</div>
		);
}

export default Pagination
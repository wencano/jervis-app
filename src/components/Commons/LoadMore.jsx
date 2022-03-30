import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';

export default class LoadMore extends React.Component {
	
	/**
	 * Constructor
	 */
	constructor(props) {
		super(props);
		
		this.pageTo = this.pageTo.bind(this);
		
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
			props.getList( component, 'append' );
		}
		
	}
	
	
	/**
	 * Render
	 */
	render() {
		let props = this.props;
		return ( props.page.current < (props.page.pages-1) ? 
			<button type="button" className={ props.className || "btn btn-primary btn-md btn-flat "} onClick={(e)=>this.pageTo('next')}>Load More...</button>
			: null
		);
	}	
		
}
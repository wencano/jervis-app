import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';


export default class FileThumbnails extends React.Component {
	
	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		let _this = this;
		this.state = {
			files: this.props.files == undefined ? [] : this.props.files
		}
		
		this.update = this.update.bind(this);
		this.fileIcon = this.fileIcon.bind(this);
	}
	
	
	/**
	 * Update
	 */
	update(e, mode, data) {
		let _this = this;
		let state = this.state;
		if(e){e.stopPropagation(); e.preventDefault();}
		
		
	}
	
	
	/**
	 * File Icon
	 */
	fileIcon(type) {
		let icon = "fa fa-file-o";
		
		if( type.indexOf( 'image' > -1 ) ) icon = "fa fa-file-image-o";
		if ( type.indexOf("pdf") > -1 ) icon = "fa fa-file-pdf-o";
		if ( type.indexOf("word") > -1 ) icon = "fa fa-file-word-o";
		if ( type.indexOf("excel") > -1 ) icon = "fa fa-file-excel-o";
		if ( type.indexOf("video") > -1 ) icon = "fa fa-file-movie-o";
		if ( type.indexOf("zip") > -1 ) icon = "fa fa-file-archive-o";
		return icon; 
	}
	
	
	
	/**
	 * Render
	 */
	render() {
		let _this = this;
		let state = this.state; 
		
		return (
			<div style={{display: 'inline-block'}}>
				{ state.files && state.files.length > 0 ? <div style={{display: 'inline-block'}}>
					{state.files.map( (f,j)=> {
							let iconClass = _this.fileIcon(f.type);
							return (
								<a key={j} href={Config.admin.noSlash() + f.location} target="_blank" className="" style={{ display: 'inline-block', marginRight: '3px', marginBottom: '3px',fontSize: '16px' }} title={f.name} data-toggle="tooltip" >
									<i className={iconClass}></i>
								</a>
							)
							
						})}
					</div> : null 
				}
			</div>
		);
	}
	
		
	
	
	
	

}
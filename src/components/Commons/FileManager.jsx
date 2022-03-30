import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';


export default class FileManager extends React.Component {
	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		let _this = this;
		this.state = {
			property_id: this.props.property_id || 0,
			unit_id: this.props.unit_id || 0,
			lease_id: this.props.lease_id || 0,
			columns: this.props.columns || ['uploaded'],
			thumb: this.props.thumb || { width: '140px', height: '140px' }, 
			list: [],
			images: [],
			files: []
		}
		
		this.update = this.update.bind(this);
		
	}
	
	update(e, mode, data) {
		let _this = this;
		let state = this.state;
		
		if(e){e.preventDefault(); e.stopPropagation();}
		
		// Props
		if( mode == 'props' ) {
			state.list = data.files;
			state.images 	= _.filter( data.files, (f)=>{ return f.type.indexOf('image') > -1 } );
			state.files 	= _.filter( data.files, (f)=>{ return f.type.indexOf('image') == -1 } );
			state.property_id = data.property_id || 0;
			state.unit_id = data.unit_id || 0;
			state.lease_id = data.lease_id || 0;
			state.columns = data.columns || ['uploaded'];
			state.thumb = data.thumb || { width: '140px', height: '140px' };
			_this.setState(state);
		}
		
		// Delete
		if ( mode == 'file_delete' ) {
			
			if( confirm( 'Are you sure you want to delete this file?' ) ) {
				
				$.post( Config.api + "files/delete/", { session_key: this.props.data.session_key, data: { id: data, property_id: state.property_id, unit_id: state.unit_id, lease_id: state.lease_id, get_files: true } }, function(res) {
					
					try{
						res = JSON.parse(res);
						if(res.success) {
							_this.props.update(null, 'update_files', {files: res.files} );
						}
					}
					catch(err) {
						console.log("Error occured ", err);
					}
				}).error( function(err) {
					console.log("Error occured ", err);
				});
			}
			
		}
		
	}
	
	
	render() {
		
		let state = this.state;
		
		return (
			<div>
				{ state.images && state.images.length > 0 ? <div className="" style={{ marginTop: '20px', textAlign: 'left', background: '#fff' }}>
					{state.images.map( (f,j)=> {
						
							return (
								<div key={j} className="hover-trigger" style={{display: 'inline-block', width: state.thumb.width, height: state.thumb.height, padding: '5px', border: '1px solid #ccc', textAlign: 'center', position: 'relative', marginRight: '6px', marginBottom: '6px' }}>
									<a href="#" className="hover-show btn btn-danger btn-xs" onClick={(e)=>this.update(e,'file_delete',f.id)} style={{ position: 'absolute', top: '-10px', right: '-10px' }} >
										<i className="fa fa-times"></i>
									</a>
									
									<a href={Config.admin.noSlash() + f.location} target="_blank" className="" style={{ display: 'inline-block', width: '100%', height: '100%', overflow: 'hidden', background: "#cccccc url('" + Config.admin.noSlash() + f.location + "') no-repeat center center", backgroundSize: '100%' }} title={f.name} data-toggle="tooltip" >
									</a>
								</div>
							)
							
						})}
					</div> : null 
				}
				
				{ state.files && state.files.length > 0 ? 
					<table className="table table-striped" style={{marginTop: '10px'}}>
						<thead>
							<tr>
								<th>Filename</th>
								{state.columns.indexOf( 'uploaded' ) > -1 ? <th style={{width: '100px'}}>Uploaded</th> : null }
								<th style={{width: '80px'}}></th>
							</tr>
						</thead>
						<tbody>{state.files.map((file,i) => {
								return (
									<tr key={i} className="hover-trigger" >
										<td>
											<a href={Config.admin.noSlash() + file.location} target="_blank" className="" style={{marginRight: '15px'}}>{file.name}</a>
										</td>
										{state.columns.indexOf( 'uploaded' ) > -1 ? <td>{moment(file.date_modified).format("MMM D, YYYY")}</td> : null }
										<td style={{textAlign: 'right'}} >
											<a href="#" className="text-danger hover-show" onClick={(e)=>this.update(e,'file_delete',file.id)}>
												<i className="fa fa-trash btn-xs"></i>
											</a>
										</td>
									</tr>
								);
						})}</tbody>
					</table>  : null
				}
				
			</div>
		);
	}
	
	componentWillMount() {
		this.update(null, 'props', this.props);
	}
	
	componentDidMount() {
		
		let _this = this;
		
		$(function(){
			
			
		});
	}
	
	
	componentWillReceiveProps( props ) {
		if( JSON.stringify( this.props ) != JSON.stringify(props) ) {
			this.update(null, 'props', props);
		}
	}
	
	
	
}
import React from 'react';
import { connect } from "react-redux"; 
import { Link } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';

import * as Helpers from '../../helpers';
import * as $api from '../../api';
import * as _api from './api';

const mapStateToProps = state => {
	return {comments: state.comments.comments};
}

class _Comments extends React.Component {
	
	/**
	 * Constructor
	 */
	constructor(props){
		super(props);
		
		this.state = {
			comment: {
				message: '',
				component: props.component,
				item_id: props.item_id
			}
		}
		
		this.formChange = this.formChange.bind(this);
		this.send = this.send.bind(this);
		this.remove = this.remove.bind(this);
		this.scrollList = this.scrollList.bind(this);
		
	}
	
	
	/**
	 * Form Change
	 */
	formChange(e) {
		let state = this.state;
		state.comment[e.target.name] = e.target.value;
		this.setState(state);
	}
	
	
	/**
	 * Send Comment
	 */
	send(e) {
		if(e) {e.preventDefault(); e.stopPropagation();}
		
		let state = this.state;
		
		_api.upsert(state.comment);
		
		state.comment.message = '';
		this.setState(state);
		
	}
	
	
	/**
	 * Delete
	 */
	remove(e,id) {
		if(e) { e.preventDefault(); e.stopPropagation();}
		if(confirm('Are you sure you want to delete this comment?')) _api.remove(id);
	}
	
	
	/**
	 * Render Component
	 */
  render() {
		let state = this.state; 
		let props = this.props;
		let comments = this.props.comments;
		
		return (
			<div className="box box-default direct-chat direct-chat-warning">
				<div className="box-header with-border">
					<h3 className="box-title">Comments</h3>

					<div className="box-tools pull-right">
						{/** <span data-toggle="tooltip" title="3 New Messages" className="badge bg-yellow">3</span>
						<button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i>
						</button>
						<button type="button" className="btn btn-box-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle">
							<i className="fa fa-comments"></i></button>
						<button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times"></i>
						</button>*/}
						<button type="button" className="btn btn-box-tool" onClick={(e)=>_api.getList()} ><i className="fa fa-refresh"></i>
						</button>
					</div>
				</div>
				
				<div className="box-body">
					<div className="comments-list direct-chat-messages" id="comments-list" >
						{comments && comments.length ? comments.map( (comment, i) => {
							return (
								<div className="direct-chat-msg" key={i} >
									<div className="direct-chat-info clearfix">
										<span className="direct-chat-name pull-left">{comment.author_name}</span>
										<span className="direct-chat-timestamp pull-right">
											{Helpers.tz(comment.date_created).format("MMM D, YYYY, h:mm a")} {
												$api.is('admin') || ( comment.author_id == $api.userId()) ? 
													<span onClick={(e)=>this.remove(e, comment.id)} title="Delete Comment" style={{cursor: 'pointer'}} ><i className="fa fa-trash"></i></span> 
													: null 
											}
										</span>
									</div>
									<div className="direct-chat-img">
										<div style={{textAlign: 'center', fontSize: '16px', border: '2px solid #000', fontWeight: 'bold', float: 'left', width: '40px', height: '40px', lineHeight: '40px', marginBottom: '0', color: '#000', display: 'table', overflow: 'hidden', borderRadius: '20px' }}>
											<div style={{display: 'table-cell', verticalAlign: 'middle', lineHeight: '1em', overflow: 'hidden'}}>{comment.author_name.initials()}</div>
										</div>
									</div>
									<div className="direct-chat-text" dangerouslySetInnerHTML={{__html: comment.message}} ></div>
									
								</div>
							)
						}) : "No comments found." }
					</div>
				</div>
				
				<div className="box-footer">
					<form action="#" method="post" onSubmit={(e)=>this.send(e)} >
						<div className="input-group">
							<input type="text" value={state.comment.message} onChange={(e)=>this.formChange(e)} name="message" placeholder="Type Message ..." className="form-control" />
							<span className="input-group-btn">
								<button type="button" className="btn btn-warning btn-flat" onClick={(e)=>this.send(e)} >Send</button>
							</span>
						</div>
					</form>
				</div>
				
			</div>
		);
	}
	
	
	/**
	 * Before Component Mount
	 */
	componentWillMount() {
		_api.setFilters({
			component: this.props.component,
			item_id: this.props.item_id
		});
		_api.getList();
	}
	
	
	/**
	 * Scroll to Bottom
	 */
	scrollList() {
		setTimeout(()=> {
			var objDiv = document.getElementById("comments-list");
			objDiv.scrollTop = objDiv.scrollHeight;
		}, 50); 
	}
	
	
	/**
	 * Component Did Mount
	 */
	componentDidMount() {
		let _this = this;
		$(function(){
			$.AdminLTE.layout.fix();
			$('.anim').addClass('anim-go');
			
			_this.scrollList();
		});
	}
	
	
	/**
	 * Update New Props
	 */
	componentWillReceiveProps(nextProps) {
		let _this = this;
		if(JSON.stringify( this.props.comments ) != JSON.stringify( nextProps.comments ) ) 
			_this.scrollList();
		
	}
	
	
	
	
	
}


const Comments = connect(mapStateToProps)(_Comments); 
export default Comments;
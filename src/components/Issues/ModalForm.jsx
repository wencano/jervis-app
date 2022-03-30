import React from 'react';
import { connect } from "react-redux"; 

import moment from 'moment';
import _ from 'lodash';

import * as _api from './api'; 
import InputDate from '../Commons/Inputs/Date.jsx';
import TextareaAutosize from 'react-textarea-autosize';

const mapStateToProps = (state) => {
	return { 
    issueDefault: state.issues.issueDefault,
    issue: state.issues.issue,
    filterParams: state.issues.filterParams
	}; 
}


class ModalIssueMain extends React.Component {
	
	constructor(props) {
		super(props);
    
    this.state = {
      issue: _.cloneDeep( props.data.issue ) || {id: 'new', issue_id: 'New Issue', date_followup: moment().format("YYYY-MM-DD")},
      updated: null
    }

    this.formChange = this.formChange.bind(this);

  }
  

  formChange(e) {
    let state = this.state;
    let props = this.props;
    state.issue[ e.target.name ] = e.target.value;
    
		if(state.updated == null) state.updated = {};
    state.updated[e.target.name] = e.target.value;
		
		this.setState(state);
	}
	
	
	render() {
    let _this = this;
    let props = this.props;
    let state = this.state;

    let disableBtn = props.loading ? 'disabled' : ''; 

    let style = {width: '600px'};
    if(AppHelpers.screenIs('xs')) style.width = '100%';

		return (
			<div className="modal-dialog modal-md" role="document" style={style}>
				<div className="modal-content" >
					<div className="modal-header"> 
            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button> 
						<strong>{state.issue.issue_id}</strong>
					</div>
					<div className="modal-body">
            <form className="form-horizontal">
              <div className="form-group">
                <label className="control-label col-sm-1 text-left">Issue</label>
						    <div className="col-sm-11">
                  <input type="text" id="issue-title" className="form-control" value={state.issue.title} onChange={this.formChange} name="title" placeholder="Title"/>
                </div>
              </div>
              <div className="form-group">
                {/** <ul id="wysihtml5-toolbar" className="wysihtml5-toolbar">
                  <li>
                    <div className="btn-group">
                      <a className="btn btn-default" data-wysihtml5-command="bold" title="CTRL+B" tabindex="-1" href="javascript:;" unselectable="on">B</a>
                      <a className="btn btn-default" data-wysihtml5-command="italic" title="CTRL+I" tabindex="-1" href="javascript:;" unselectable="on">I</a>
                      <a className="btn btn-default" data-wysihtml5-command="underline" title="CTRL+U" tabindex="-1" href="javascript:;" unselectable="on">U</a>			
                      <a className="btn btn-default" data-wysihtml5-command="small" title="CTRL+S" tabindex="-1" href="javascript:;" unselectable="on">S</a>
                    </div>
                  </li>
                  
                  <li>
                    <div className="btn-group">
                      <a className="btn btn-default" data-wysihtml5-command="insertUnorderedList" title="Unordered list" tabindex="-1" href="javascript:;" unselectable="on">
                        <span className="glyphicon glyphicon-list"></span>
                      </a>
                      <a className="btn btn-default" data-wysihtml5-command="insertOrderedList" title="Ordered list" tabindex="-1" href="javascript:;" unselectable="on">
                        <span className="glyphicon glyphicon-th-list"></span>
                      </a>
                      <a className="btn btn-default" data-wysihtml5-command="Outdent" title="Outdent" tabindex="-1" href="javascript:;" unselectable="on">
                        <span className="glyphicon glyphicon-indent-right"></span>
                      </a>
                      <a className="btn btn-default" data-wysihtml5-command="Indent" title="Indent" tabindex="-1" href="javascript:;" unselectable="on">
                        <span className="glyphicon glyphicon-indent-left"></span>
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="btn-group">
                      <a className="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="p">P</a>
                      <a className="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1">H1</a>
                      <a className="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h2">H2</a>
                      <a className="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h3">H3</a>
                      <a className="btn btn-default" data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h4">H4</a>
                    </div>
                  </li>
                </ul> */}
                <div className="col-sm-12">
                  <TextareaAutosize id="issue-description" minRows={6} className="form-control" value={state.issue.description} onChange={this.formChange} name="description" placeholder="Description" />
                </div>
              </div>


              {/** 
              <div className="form-group">
                <label htmlFor="exampleInputFile">File input</label>
                <input type="file" id="exampleInputFile" />
                <p className="help-block">Example block-level help text here.</p>
              </div>
              <div className="checkbox">
                <label>
                  <input type="checkbox" /> Check me out
                </label>
              </div>  */}

              <div className="form-group">
                <label className="control-label col-sm-3 text-left">Assigned To</label>
                <div className="col-sm-4">
                  <input type="text" className="form-control" value={state.issue.assigned_to} onChange={this.formChange} name={"assigned_to"} placeholder="Assignee Name" />
                </div>
              </div>

              <div className="form-group">
                <label className="control-label col-sm-3 text-left">Est. Delivery Date</label>
                <div className="col-sm-3">
                  <InputDate className="form-control input-md" inputId={"issue-edd"} value={moment(state.issue.date_followup).format("YYYY-MM-DD")} onChange={this.formChange} name="date_followup" icon={AppHelpers.getScreen() != 'xs'}/> 
                </div>
              </div>

              <div className="form-group">
                <label className="control-label col-sm-1 text-left">Done</label>
                <div className="col-sm-11">
                  <TextareaAutosize id="issue-description" minRows={6} className="form-control" value={state.issue.done} onChange={this.formChange} name="done" placeholder="Done Actions" />
                </div>
              </div>

              <div className="form-group">
                <label className="control-label col-sm-1 text-left">Next Steps</label>
                <div className="col-sm-11">
                  <TextareaAutosize id="issue-description" minRows={6} className="form-control" value={state.issue.next_steps} onChange={this.formChange} name="next_steps" placeholder="Next steps" />
                </div>
              </div>
              
              
            </form>
						
					</div>
          <div className="modal-footer" style={{position: 'absolute', width: '100%', bottom: 0, left: 0}}>
						<div className="pull-left">
							<button className={ "btn btn-sm btn-success " + disableBtn } onClick={(e)=>{_api.upsert( state.updated, state.issue, ()=>{
                _this.setState({...state, updated: null});
                _this.props.data.getList();
                 }); 
                 props.closeModal();
                 }} >Save</button>&nbsp;
              <button className="btn btn-sm btn-danger" onClick={(e)=>{_api.remove(state.issue.id, ()=>{
								_this.props.data.getList();
							});
							props.closeModal();
							}}>Delete</button>
              <button className={ "btn btn-sm btn-default " + disableBtn } onClick={ disableBtn == '' ? props.closeModal : ()=>(false) }>Close</button>
						</div>
            
            <div className="pull-right">
              
            </div>
						
						
						<div className="text-center">
							{props.loading ? <span><i className="fa fa-refresh fa-spin"></i> Processing...</span>: null }
						</div>
					</div>
				</div>
			</div>
		);
		
  }

  componentWillUnmount(){
    let _this = this;
    _this.props.onModalClose( _this.props.data.closeIssue );
  }

  componentDidMount() {
    //$('#issue-description').wysihtml5();
    /** 
    var editor = new wysihtml5.Editor(document.getElementById('issue-description'), {
      toolbar:document.getElementById('wysihtml5-toolbar')
    }); */
  }

}
	
	
const ModalIssue = connect(mapStateToProps)(ModalIssueMain); 
export default ModalIssue;
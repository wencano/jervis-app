import React, {Component, PropTypes} 		from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import _ 				from 'lodash';
import moment 	from 'moment';

import * as $api from '../../api';
import * as Helpers from '../../helpers';


export default class PopoverTechCompleted extends React.Component {
	
	/**
	 * Constructor
	 */
	constructor(props) {
		super(props);
		
		this.state = {
      id: props.id || 'popover-id',
      tech_id: props.tech_id,
      projects: [],
      fetched: false
    }
    
    this.fetchProjects = this.fetchProjects.bind(this);
	}
  
  
  /**
   * Fetch Projects
   */
  fetchProjects(bspopover) {
    let _this = this; 
    let state = this.state;
    let props = this.props;

    var popover = $('#'+state.id).data('bs.popover').tip();
    var contentEl = popover.find(".popover-content");
    
    popover.css({minWidth: '300px', maxWidth: '600px', maxHeight: 400});
    contentEl.css({width: 'auto', height: 350, maxHeight: 350, overflowX: 'hidden', overflowY: 'auto'});
    
    Helpers.post( 'projects/listall/', {session_key: $api.sessionKey(), tech_id: props.tech_id, status: 4 }, function(res, raw){
      
      var html = "<div><ol>";
      if(res && res.success && res.projects && res.projects.length ) {
        
        state.projects = res.projects;
        state.fetched = true; 
        _this.setState(state);


        res.projects.map( (project,i) => {
          
          html += '<li>' + 
                  '<a href="' + Config.root + 'projects/' + project.id + '/' + '" target="_blank"><b>' + project.title + '</b><br />' + moment(project.date_dispatched).format("MMM D, YYYY") + " &bull; " + project.location_name + '</a>' +
                '</li>';
        });

      }

      else {
        html += 'No completed projects found.';
      }

      html += '</ol></div>';
      
      contentEl.html(html);
    });
  }

	
	/**
	 * Render
	 */
	render() {
    let state = this.state;
    let props = this.props; 
		return (
      <a href="javascript:;" role="button" id={state.id} data-toggle="popover" data-placement={ props.placement || "right"} title={props.title} data-content={props.content||'<i class="fa fa-refresh fa-spin"></i> Loading...'}>{this.props.children}</a>
    )
  }	
  

  /**
	 * Component Did Mount
	 */
	componentDidMount() {
    let _this = this;
    let state = this.state;
    let props = this.props; 
		$(function () {
      $('#'+state.id).popover({html: true, container: 'body'})
        .on('show.bs.popover', _this.fetchProjects );
		})
  }


  /**
   * Component Will Unmount
   */
  componentWillUnmount() {
    $('#'+this.state.id).popover('hide');
  }

		
}
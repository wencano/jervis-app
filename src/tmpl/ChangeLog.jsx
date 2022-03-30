import React from 'react';
import {Link, browserHistory} from 'react-router';
import MarkDownIt from 'markdown-it';

import * as Helpers from '../helpers';
import * as $api from '../api';

const md = new MarkDownIt();

export default class changelog extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			changelog: ''
		}
	}

	render() {
		return (
			<div className="content-wrapper">
				<section className="content" dangerouslySetInnerHTML={{__html: this.state.changelog }}></section>
			</div>
		)
	}

	componentWillMount() {
		if(!$api.allowed(['admin', 'dispatcher'])) browserHistory.push( Config.root + 'notfound/');
		else {
			let _this = this;

			Helpers.post('changelog/', {}, function(res){
				if(res && res.success) _this.setState({changelog: md.render( res.changelog )});
			});
		}
	}

}
import React from 'react';
import { Link } from 'react-router';
import * as $api from '../api';

export default class Footer extends React.Component {
   render() {
	  
	  return (
      <footer className="main-footer">
				<div className="pull-right hidden-xs">
					{ $api.allowed(['admin','dispatched']) ? <Link to={Config.root + 'changelog/'}><b>Version</b> {Config.version}</Link> : <span><b>Version</b> {Config.version}</span> }
				</div>
				<strong>Copyright &copy; {(new Date()).getFullYear()} <Link to="https://powersiot.com/" target="_blank">Powers IoT</Link>.</strong> All rights reserved.
		  </footer>
      )
   }
}


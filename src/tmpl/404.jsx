import React from 'react';
import {Link} from 'react-router';

export default class NotFound extends React.Component {
	
	render() {
		return (
			<div className="content-wrapper">
				<section className="content">
					<div className="error-page">
						<h2 className="headline text-yellow"> 404</h2>

						<div className="error-content">
							<h3><i className="fa fa-warning text-yellow"></i> Oops! Page not found.</h3>

							<p>
								We could not find the page you were looking for.
								Meanwhile, you may <Link to={Config.root }>return to home page</Link>.
							</p>

						</div>
					</div>
				</section>
			</div>
		)
	}
}
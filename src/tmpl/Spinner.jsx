import React from 'react';

const Spinner = (props) => (
	<div className="overlay-wrapper" >
		<div className="overlay">
			<i className="fa fa-refresh fa-spin"></i>
		</div>
	</div> 
);

export default Spinner;
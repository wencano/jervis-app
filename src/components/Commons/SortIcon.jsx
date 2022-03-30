import React from 'react';

const SortIcon = (props) => {
	let icon = props.sort && props.sort.by == props.column ? <i className={ "fa fa-long-arrow-" + (props.sort.dir == 'asc' ? 'up' : 'down') }></i> : null;
	return icon;
	
};

export default SortIcon;
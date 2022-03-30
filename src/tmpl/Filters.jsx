import React from 'react';

import Pagination from './Pagination.jsx';


export default class Filters extends React.Component { 
	constructor() {
		super();
		
		this.state = {
			show: false,
			screen: 'xs'
		}
		
	}
	
	render() {
		let props = this.props;
		let showHide = { display: 'block' };
		if(!this.state.show) showHide.display = 'none';
		
		return (
			<div className={"dynamic-filter-row " + this.props.className } >
				
				<div className="visible-xs text-blue" onClick={()=>this.setState({...this.state, show: !this.state.show})} style={{margin: '0 0 6px 0', cursor: 'pointer'}}>
					<b><i className="fa fa-filter"></i> {!this.state.show ? 'Show' : 'Hide'} Filter</b>
				</div>
				<div className="dynamic-filter-wrapper " style={showHide}>
					{props.children}
				</div>
				
			</div>
		)
	}
	
	
	
	componentDidMount() {
		let _this = this;
		$(()=> {
			
			// Detect Bootstrap
			let state = _this.state;
			state.screen = AppHelpers.getScreen();
			state.show = state.screen == 'xs' ? false : true;
			_this.setState(state);
			
			if( !state.show ) $('.dynamic-filter-row .dynamic-filter-wrapper').slideUp(300);
			
			// Automatic Resize
			$(window).resize( function() {
				
				AppHelpers.waitForFinalEvent( function() {
					let screen = AppHelpers.getScreen();
					
					if(screen != state.screen) {
						
						state.screen = screen; 
						state.show = state.screen == 'xs' ? false : true;
						_this.setState(state);
						
						if( !state.show ) $('.dynamic-filter-row .dynamic-filter-wrapper').slideUp(300);
						else $('.dynamic-filter-row .dynamic-filter-wrapper').slideDown(300);
						
					}
					
				});
			});
		});
	}
	
	componentDidUpdate() {
		
	}
	
}

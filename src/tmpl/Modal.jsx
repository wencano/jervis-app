import React from 'react';


export default class UIModal extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			id: props.data && props.data.id ? props.data.id : 'global-modal',
			className: props.data && props.data.className ? props.data.className : "modal fade"
		}

		this.modalEl = this.modalEl.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	modalEl() {
		return $('#'+this.state.id);
	}
	
	closeModal() {
		this.modalEl().modal('hide');
	}
	
	onModalClose(fn) {
		
		if( fn ) fn();
		
	}
	
	render() {
		
		const Child = this.props.ModalChild;
		
		return(
			<div id={this.state.id} className={this.state.className} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" >
				<Child data={this.props.data} main={this.props.main} closeModal={this.closeModal} onModalClose={this.onModalClose} afterModalClose={this.props.afterModalClose} />
			</div>
		);
		
	}
	
	componentDidMount() {
		
		let _this = this;
		
		$(function(){
			_this.modalEl().modal( _this.props.data.modalConfig || {} );
			_this.modalEl().on('hidden.bs.modal', function () {
				_this.onModalClose();
				_this.props.afterModalClose();
			});
		});
		
	}
	
	
}
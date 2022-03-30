// app/components/Comments/store.js
// import * as comCommentsStore from './components/Comments/store';
import moment from 'moment';

const initialState = {
	comments: [],
	filters: { component: 'comments', item_id: '' }
};

// Action Name Creator
const createActionName = name => `app/comments/${name}`;

// Reducer (to be registered in ./app/store.js)
export default function reducer(state = initialState, action = {}) {
	
  switch (action.type) {
    
		case SETFILTERS: 
			return {...state, filters: action.payload};
		
		
		case SET: 
			return {...state, comments: action.payload};
			
		case PUSH:
			return {...state, comments: [...state.comments, action.payload] }
			
		default:
      return state;
		
  }
}


// Actions
export const SETFILTERS = createActionName( 'setfilter' )
export const SET = createActionName("set");
export const PUSH = createActionName('push');

// Action Creators
export const setFilters = payload => ({payload, type: SETFILTERS})
export const set = payload => ({payload, type: SET});
export const push = payload => ({payload, type: PUSH});
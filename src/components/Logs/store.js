// app/components/Logs/store.js
// import * as comLogsStore from './components/Logs/store';
import moment from 'moment';

const initialState = {
	logs: []
};

// Action Name Creator
const createActionName = name => `app/logs/${name}`;

// Reducer (to be registered in ./app/store.js)
export default function reducer(state = initialState, action = {}) {
	
  switch (action.type) {
    
		case SET: 
			return {...state, logs: action.payload};
			
		default:
      return state;
		
  }
}


// Actions
export const SET = createActionName("set");

// Action Creators
export const set = payload => ({payload, type: SET});
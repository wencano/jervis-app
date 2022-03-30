// app/components/Settings/store.js
// import * as comSettingsStore from './components/Settings/store';
import moment from 'moment';

const initialState = {
	settings: {}
};

// Action Name Creator
const createActionName = name => `app/settings/${name}`;

// Reducer (to be registered in ./app/store.js)
export default function reducer(state = initialState, action = {}) {
	
  switch (action.type) {
    
		case _SET: 
			return {...state, settings: action.payload};
		
    default:
      return state;
		
  }
}


// Actions
export const _SET = createActionName("set");

// Action Creators
export const set = payload => ({payload, type: _SET});
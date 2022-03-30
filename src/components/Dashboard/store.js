// app/components/Dashboard/store.js
// import * as comDashboardStore from './components/Dashboard/store';
import moment from 'moment';

const initialState = {
	dashboard: {
		projects: {
			draft: 0,
			new: 0,
			accepted: 0,
			dispatched: 0
		},
		locations: 0,
		technicians: 0
	}
};

// Action Name Creator
const createActionName = name => `app/dashboard/${name}`;

// Reducer (to be registered in ./app/store.js)
export default function reducer(state = initialState, action = {}) {
	
  switch (action.type) {
    
		case SET: 
			return {...state, dashboard: action.payload};
			
		default:
      return state;
		
  }
}


// Actions
export const SET = createActionName("set");

// Action Creators
export const set = payload => ({payload, type: SET});
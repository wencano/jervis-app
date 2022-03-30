// app/components/Notifications/store.js
// import * as comNotificationsStore from './components/Notifications/store';
import moment from 'moment';
import _ from 'lodash'; 

const initialState = {
	notifications: [],
	unread: [],
	limit: 100
};

// Action Name Creator
const createActionName = name => `app/notifications/${name}`;

// Reducer (to be registered in ./app/store.js)
export default function reducer(state = initialState, action = {}) {
	
  switch (action.type) {
    
		case SET: 
			return {...state, notifications: action.payload};
			
		case UNREAD: 
			return {...state, unread: action.payload};
		
		case READ: 
			
			return {...state, notifications: action.payload.notifications, unread: action.payload.unread };
			
			
		
    default:
      return state;
		
  }
}


// Actions
export const SET = createActionName("set");
export const UNREAD = createActionName("unread");
export const READ = createActionName("read");

// Action Creators
export const set = payload => ({payload, type: SET});
export const setUnread = payload => ({payload, type: UNREAD});
export const setRead = payload => ({payload, type: READ});
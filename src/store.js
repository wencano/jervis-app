import { createStore, combineReducers, applyMiddleware } from "redux"; 
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { routerReducer as routing, routerMiddleware } from 'react-router-redux';


/**
 * Import Component Reducers
 */
import appdata from './appstore';
import dashboard from './components/Dashboard/store';
import users from './components/Users/store';
import settings from './components/Settings/store';
import notifications from './components/Notifications/store';
import logs from './components/Logs/store';
import comments from './components/Comments/store';
import projects from './components/Projects/store';
import issues from './components/Issues/store';




/**
 * Register Component Reducers
 */
const rootReducer = combineReducers({
  appdata, 
	dashboard,
	users,
	settings,
	projects,
	issues,
	logs,
	comments,
	notifications,
	routing
});


// Define Initial State
const initialState = {};

// Apply Middleware
const router = routerMiddleware(browserHistory);
const enhancer = applyMiddleware(thunk, router);

// Create Store
const store = createStore( rootReducer, initialState, enhancer ); 
export default store;

export const dispatch = (fn) => store.dispatch(fn);
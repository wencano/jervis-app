// app/components/OrderItems/store.js
// import * as comOrderItemsStore from './components/OrderItems/store';
import moment from 'moment';
import _ from 'lodash';

const initialState = {
	
	issueDefault: {
		id: 'new',
		customer_id: 0,
		customer_name: '',
		title: '',
		short_code: '',
		description: '',
		edit: true
	},

	issues: [],
	issue: null, 
	q: "",
	filterParams: {},
	filtersDefault: { id: "", project_id: 4 },
	filters: {},
	sort: { by: "id", dir: "desc" },
	page: { pages: 0, total: 0, current: 0, size: 50 },
	
};

// Action Name Creator
const createActionName = name => `app/issues/${name}`;

// Reducer (to be registered in ./app/store.js)
export default function reducer(state = initialState, action = {}) {
	
	let s = _.cloneDeep( state );
	
  switch (action.type) {
    
		case SET: 
			return action.payload;
		
		case SETFILTERPARAMS: 
			if( action.component ) s[ action.component ].filterParams = action.payload;
			else s.filterParams = action.payload;
			return s;
			
		case SETFILTERS: 
			if( action.component ) s[ action.component ].filters = action.payload;
			else s.filters = action.payload;
			return s;
			
		case SETSORT:
			if( action.component ) s[ action.component ].sort = action.payload;
			else s.sort = action.payload;
			return s;
			
		case SETPAGE:
			if( action.component ) s[ action.component ].page = action.payload;
			else s.page = action.payload;
			return s;

		case SETISSUES:
			if( action.mode == 'append' ) s.issues = s.issues.concat( action.payload );
			else s.issues = action.payload;
			return {...state, issues: s.issues };

		case SETISSUE:
			return {...state, issue: action.payload};
		
    default:
      return state;
		
  }
}


// Actions
export const SET = createActionName("set");
export const SETISSUES = createActionName("setissues");
export const SETISSUE = createActionName("setissue");
export const SETFILTERPARAMS = createActionName('setFilterParams');
export const SETFILTERS = createActionName("filters");
export const SETSORT = createActionName('sort')
export const SETPAGE = createActionName('page')


// Action Creators
export const set = payload => ({payload, type: SET});
export const setIssues = (payload, mode) => ({type: SETISSUES, payload, mode});
export const setIssue = payload => ({payload, type: SETISSUE});
export const setFilterParams = payload => ({payload, type: SETFILTERPARAMS});
export const setFilters = payload => ({payload, type: SETFILTERS});
export const setSort = (payload, component) => ({type: SETSORT, payload, component})
export const setPageParams = payload => ({payload, type: SETPAGEPARAMS})
export const setPage =(payload, component) => ({ type: SETPAGE, payload, component })
// app/components/Users/store.js
// import * as comUsersStore from './components/Users/store';
import moment from 'moment';
import _ from 'lodash';

const initialState = {
	userDefault: {
		id: 'new',
		name: '',
		name_first: '',
		name_last: '',
		email: '',
		pass: '',
		photo: '',
		timezone: 'America/New_York',
		date_created: moment().format("YYYY-MM-DD"),
		date_modified: moment().format("YYYY-MM-DD"),
		notes: '',
		type: 'technician',
		hourly_rate: '0.00'
	},
	
	users: [],
	
	user: null, 
	
	filterParams: {
		locations: []
	},
	
	q: "",
	
	filtersDefault: { name: "", email: "", type: "technician", status: "" },
	filters: { name : "", email : "", type : "technician" },
	sort: { by: "name", dir: "asc" },
	page: { pages: 0, total: 0, current: 0, size: 50 },
	
	// Others
	projects: {
		filters: { id: "", title: "", date_created: "", date_schedule: "" },
		sort: { by: "date_created", dir: "desc" },
		page: { pages: 0, total: 0, current: 0, size: 50 }
	},
	
	locations: {
		filters: { city: "", with_projects: '' },
		sort: { by: "date_created", dir: "desc" },
		page: { pages: 0, total: 0, current: 0, size: 50 }
	}
		
};

// Action Name Creator
const createActionName = name => `app/users/${name}`;

// Reducer (to be registered in ./app/store.js)
export default function reducer(state = initialState, action = {}) {
	let s = _.cloneDeep( state );
	
  switch (action.type) {
    
		case _ADD:
      return {...state, users: action.payload };
		
		case _EDIT:
			return {...state, editId: action.payload };
		
		case _SET: 
			return action.payload;
			
		case _SETUSER: 
			return {...state, user: action.payload };
			
		case _SETUSERS: 
			if( action.mode == 'append' ) s.users = s.users.concat( action.payload );
			else s.users = action.payload; 
			return {...state, users: s.users };
			
    case _REMOVE:
      return state.slice(1);
			
		case _CLEAR: 
			return [];
		
		case SETFILTERS: 
			if( action.component ) s[ action.component ].filters = action.payload;
			else s.filters = action.payload;
			return s;
			
		case SETFILTERPARAMS: 
			return {...state, filterParams: action.payload};
			
		case SETSORT:
			if( action.component ) s[ action.component ].sort = action.payload;
			else s.sort = action.payload;
			return s;
			
		case SETPAGE:
			if( action.component ) s[ action.component ].page = action.payload;
			else s.page = action.payload;
			return s;
			
		case SETPAGEPARAMS: 
			return {...state, page: action.payload};
			
    default:
      return state;
		
  }
}


// Selectors
export const selectAll = state => state.users;
export const selectNext = state => state.users[0];


// Actions
export const _ADD = createActionName("add");
export const _EDIT = createActionName("edit");
export const _SET = createActionName("set");
export const _SETUSERS = createActionName("setusers");
export const _SETUSER = createActionName("setuser");
export const _REMOVE = createActionName("remove");
export const _CLEAR = createActionName("clear");

export const SETFILTERS = createActionName("filters")
export const SETFILTERPARAMS = createActionName( 'filterparams' )
export const SETSORT = createActionName('sort')
export const SETPAGE = createActionName('page')
export const SETPAGEPARAMS = createActionName('pageParams')


// Action Creators
export const add = payload => ({ payload, type: _ADD });
export const edit = payload => ({ payload, type: _EDIT });
export const set = payload => ({payload, type: _SET});
export const setUser = payload => ({payload, type: _SETUSER});
export const setUsers = (payload, mode) => ({type: _SETUSERS, payload, mode});
export const del = () => ({ type: _REMOVE });
export const clear = () => ({type: _CLEAR});

export const setFilters = (payload, component) =>( {type: SETFILTERS, payload, component} )
export const setFilterParams = payload => ({payload, type: SETFILTERPARAMS})
export const setSort = (payload, component) => ({type: SETSORT, payload, component})
export const setPageParams = payload => ({payload, type: SETPAGEPARAMS})
export const setPage = (payload, component) => ({ type: SETPAGE, payload, component })
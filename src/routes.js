import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App.jsx';

// TMPL
import Auth from './tmpl/Auth.jsx';
import NotFound from './tmpl/404.jsx';

// Component: Users
import Dashboard from './components/Dashboard/Index.jsx';
import Profile from './components/Users/Profile.jsx';
import Users from './components/Users/Index.jsx';
import UserForm from './components/Users/Form.jsx';
import UserDetails from './components/Users/Details.jsx';

// Component: Notifications
import Notifications from './components/Notifications/List.jsx';

// Component: Logs
import Logs from './components/Logs/List.jsx';

// Component: Settings
import Settings from './components/Settings/Settings.jsx';
import SettingsForm from './components/Settings/Form.jsx';

// Component: Projects
import Projects from './components/Projects/List.jsx';
import ProjectForm from './components/Projects/Form.jsx';
import ProjectDetails from './components/Projects/Details.jsx';

// Component: Issues
import Issues from './components/Issues/List.jsx';
import IssueForm from './components/Issues/Form.jsx';
import IssueDetails from './components/Issues/Details.jsx';

// Utility: Changelog
import ChangeLog from './tmpl/ChangeLog.jsx';

// Export Routes List
export default (
  <Route path={Config.root} component={App}>
		<IndexRoute component={Dashboard} />		
		
		<Route path="reset-password/" component={Auth} />
		<Route path="verify-reset-password/:reset_key/" component={Auth} />
		<Route path="signup/" component={Auth} tab="signup" />
		<Route path="signup/skills/" component={Auth} tab="signup" />
		<Route path="signup/success/" component={Auth} tab="signup-success" />
		
		// Component: Users
		<Route path="users/" component={Users} tab='technician' />
		<Route path="users/technicians/" component={Users} tab='technician' />
		<Route path="users/distributors/" component={Users} tab='distributor' />
		<Route path="users/dispatchers/" component={Users} tab='dispatcher'/>
		<Route path="users/admins/" component={Users} tab='admin'/>
		<Route path="users/new/" component={UserForm} />
		<Route path="users/new/:type/" component={UserForm} />

		// Component: Users Profile
		<Route path="profile/" component={Profile} tab="" />
		<Route path="profile/password/" component={Profile} tab="password" />
		<Route path="profile/work-info/" component={Profile} tab="work-info" />
		<Route path="profile/availability/" component={Profile} tab="availability" />
		
		// UserDetails
		<Route path="users/:id/" component={UserDetails} tab='' />
		<Route path="users/:id/projects/" component={UserDetails} tab='projects' />
		<Route path="users/:id/locations/" component={UserDetails} tab='locations' />
		<Route path="users/:id/availability/" component={UserDetails} tab='availability' />
		<Route path="users/:id/logs/" component={UserDetails} tab='logs' />
		<Route path="users/:id/edit/" component={UserForm} />

		// Component: Settings
		<Route path="settings/" component={Settings} />
		<Route path="settings/edit/" component={SettingsForm} />

		// Component: Projects
		<Route path="projects/" component={Projects} />
		<Route path="projects/new/" component={ProjectForm} />
		<Route path="projects/:id/" component={ProjectDetails} />
		<Route path="projects/:id/edit/" component={ProjectForm} />

		// Component: Issues
		<Route path="issues/" component={Issues} />
		<Route path="issues/new/" component={IssueForm} />
		<Route path="issues/:id/" component={IssueDetails} />
		<Route path="issues/:id/edit/" component={IssueForm} />


		
		// Component: Logs
		<Route path="logs/" component={Logs} />
		
		// Component: Notifications
		<Route path="notifications/" component={Notifications} />
		
		// Utility: ChangeLog
		<Route path="changelog/" component={ChangeLog} />
		
		// 404
		<Route path="*" component={NotFound} />
		
  </Route>
);

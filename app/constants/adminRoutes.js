// @material-ui/icons
// import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
import Dashboard from '@material-ui/icons/Dashboard';
import Ballot from '@material-ui/icons/Ballot';
import People from '@material-ui/icons/People';
// core components/views for Admin layout
// import UserProfile from 'views/UserProfile/UserProfile.jsx';
import HomePage from 'containers/HomePage';
import Users from 'containers/Users/Users';
import Roles from 'containers/Roles/Roles';
import Role from 'containers/Roles/Role';
import Permissions from 'containers/Permissions/Permissions';
import routes from 'constants/routes.json';
import UsersFilterPage from 'containers/UsersFilterPage/UsersFilterPage';

const dashboardRoutes = [
  {
    path: routes.DASHBOARD,
    name: 'Dashboard',
    icon: Dashboard,
    component: HomePage,
    layout: routes.ADMIN,
    visible: true
  },
  {
    path: routes.USERS,
    name: 'Users',
    icon: People,
    component: Users,
    layout: routes.ADMIN,
    visible: true,
    children: [
      {
        path: routes.FILTER,
        link: routes.FILTER.replace(':role', 'student'),
        name: 'Students',
        icon: People,
        component: UsersFilterPage,
        layout: routes.ADMIN,
        visible: true
      },
      {
        path: routes.ROLE,
        name: 'Role',
        icon: Person,
        component: Role,
        layout: routes.ADMIN,
        visible: false
      },
    ]
  },
  {
    path: routes.FILTER,
    link: routes.FILTER.replace(':role', 'student'),
    name: 'Students',
    icon: People,
    component: UsersFilterPage,
    layout: routes.ADMIN,
    visible: true
  },
  // {
  //   path: routes.USERS,
  //   name: 'Users',
  //   icon: Person,
  //   component: Users,
  //   layout: routes.ADMIN,
  //   visible: true
  // },
  {
    path: routes.ROLE,
    name: 'Role',
    icon: Person,
    component: Role,
    layout: routes.ADMIN,
    visible: false
  },
  {
    path: routes.ROLES,
    name: 'Roles',
    icon: Person,
    component: Roles,
    layout: routes.ADMIN,
    visible: true
  },
  {
    path: routes.PERMISSIONS,
    name: 'Permissions',
    icon: Ballot,
    component: Permissions,
    layout: routes.ADMIN,
    visible: true
  }
];

export default dashboardRoutes;

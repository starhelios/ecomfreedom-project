import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, forEach, find } from 'lodash';
import moment, * as moments from 'moment';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
// core components
import Modal from 'components/Modal/Modal';
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import TableList from 'components/Table/TableList';
import Card from 'components/Card/Card';
// import CardHeader from 'components/Card/CardHeader.jsx';
import CardBody from 'components/Card/CardBody';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import { getUsers, getFilters } from '../../redux/actions/users';

const styles = {
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0'
    },
    '& a,& a:hover,& a:focus': {
      color: '#FFFFFF'
    }
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1'
    }
  },
  fab: {
    background: 'orange',
    elevation: 1
  }
};

class UsersFilterPage extends Component {
  state = {
    open: false,
    openConfirm: false,
    editId: null,
    deleteItem: null,
    name: '',
    description: '',
    role: {}
  };

  componentWillMount() {
    this.setRole();
    this.props.getFiltersAction();
    this.props.getUsersAction();
  }

  componentDidUpdate(prevProps) {
    const { roles } = this.props;

    if (prevProps.roles !== roles) {
      this.setRole();
    }
  }

  setRole = () => {
    const { match, roles } = this.props;
    const roleName = match && match.params && match.params.role;
    const role = find(roles, item => item.name === roleName);

    if (role) {
      this.setState({ role });
    }
  };

  handleAddNew = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, openConfirm: false, name: '', description: '', editId: null, deleteItem: null });
  };

  handleSubmit = () => {
    const { name, description, editId } = this.state;
    const { createUserAction } = this.props;
    const payload = { name, description };

    if (editId) {
      payload.id = editId;
    }

    createUserAction(payload);
    this.handleClose();
  };

  onChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  prepareData = data =>
    map(data, item => {
      const { roles, created, loginLast, loginCount, ...rest } = item;

      return {
        ...rest,
        roles: map(roles, p => p.name).join(', '),
        created: created && moment(created).format('YYYY-MM-DD HH:mm:ss'),
        loginLast: loginLast && moment(loginLast).format('YYYY-MM-DD HH:mm:ss'),
        loginCount
      };
    });

  renderNavbar = classes => (
    <Fab variant="extended" size="medium" aria-label="like" className={classes.fab} onClick={this.handleAddNew}>
      Add User
    </Fab>
  );

  render() {
    const { data, roles, filters, classes } = this.props;
    const { role } = this.state;

    console.log('role', role, roles);
    console.log('filters', filters);
    return (
      <>
        <AdminNavbar title={role.description || ''} />
        <AdminContent>
          <FormControl className={classes.formControl}>
            <Select onChange={this.handleChange} displayEmpty className={classes.selectEmpty}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <FormHelperText>Without label</FormHelperText>
          </FormControl>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardBody>
                  <TableList
                    tableHeaderColor="info"
                    tableHead={['Email', 'Roles', 'Created', 'Last Login', 'Login Count']}
                    tableColumns={['email', 'roles', 'created', 'loginLast', 'loginCount']}
                    tableData={this.prepareData(data)}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </AdminContent>
      </>
    );
  }
}

UsersFilterPage.propTypes = {
  getUsersAction: PropTypes.func.isRequired,
  getFiltersAction: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.any).isRequired,
  data: PropTypes.array,
  total: PropTypes.number
};

const mapStateToProps = ({ users }) => ({
  roles: users.roles.data,
  filters: users.filters,
  data: users.users.data,
  total: users.users.total
});

const mapDispatchToProps = dispatch => ({
  getUsersAction: () => {
    dispatch(getUsers());
  },
  getFiltersAction: data => {
    dispatch(getFilters(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(UsersFilterPage));

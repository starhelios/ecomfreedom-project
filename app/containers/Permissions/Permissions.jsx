import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
// core components
import Modal from 'components/Modal/Modal';
import GridItem from 'components/Grid/GridItem.jsx';
import GridContainer from 'components/Grid/GridContainer.jsx';
import Table from 'components/Table/Table.jsx';
import Card from 'components/Card/Card.jsx';
// import CardHeader from 'components/Card/CardHeader.jsx';
import CardBody from 'components/Card/CardBody.jsx';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import { getPermissions, createPermission, deletePermission } from "../../redux/actions/users";

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

class Permissions extends Component {
  state = {
    open: false,
    name: '',
    description: ''
  }

  componentDidMount() {
    this.props.getPermissionsAction();
  }

  handleAddNew = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false, name: '', description: '' });
  };

  handleSubmit = () => {
    const { name, description } = this.state;
    const { createPermissionAction } = this.props;
    console.log('handleSubmit', name, description);
    createPermissionAction({ name, description });
  }

  onChange = field => event => {
    this.setState({ [field]: event.target.value });
  }

  onDelete = name => {
    const { deletePermissionAction } = this.props;
    deletePermissionAction({ name });
  }

  renderModal = () => {
    const { open } = this.state;

    return (
      <Modal
        open={open}
        maxWidth="md"
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
        title="Add New Permission"
      >
        <TextField
          autoFocus
          margin="dense"
          id="name"
          name="name"
          label="Name"
          type="text"
          fullWidth
          onChange={this.onChange('name')}
        />
        <TextField
          autoFocus
          margin="dense"
          id="description"
          name="description"
          label="Description"
          type="text"
          fullWidth
          onChange={this.onChange('description')}
        />
      </Modal>
    );
  }

  render() {
    const { classes } = this.props;
    const navbarActions = (
      <Fab elevation={1} variant="extended" size="medium" aria-label="like" className={classes.fab} onClick={this.handleAddNew}>
        Add Permission
      </Fab>
    );

    return (
      <>
        <AdminNavbar title='Permissions' right={navbarActions}/>
        <AdminContent>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardBody>
                  <Table
                    tableHeaderColor='info'
                    tableHead={['ID', 'Name', 'Description', 'City', 'Salary']}
                    tableData={[
                      ['1', 'Dakota Rice', '$36,738', 'Niger', 'Oud-Turnhout'],
                      ['2', 'Minerva Hooper', '$23,789', 'Curaçao', 'Sinaai-Waas'],
                      ['3', 'Sage Rodriguez', '$56,142', 'Netherlands', 'Baileux'],
                      [
                        '4',
                        'Philip Chaney',
                        '$38,735',
                        'Korea, South',
                        'Overland Park'
                      ],
                      [
                        '5',
                        'Doris Greene',
                        '$63,542',
                        'Malawi',
                        'Feldkirchen in Kärnten'
                      ],
                      ['6', 'Mason Porter', '$78,615', 'Chile', 'Gloucester']
                    ]}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </AdminContent>
        {this.renderModal()}
      </>
    );
  }
}

Permissions.propTypes = {
  getPermissionsAction: PropTypes.func,
  createPermissionAction: PropTypes.func,
  deletePermissionAction: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  getPermissionsAction: () => {
    dispatch(getPermissions());
  },
  createPermissionAction: data => {
    dispatch(createPermission(data));
  },
  deletePermissionAction: data => {
    dispatch(deletePermission(data));
  },
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Permissions));

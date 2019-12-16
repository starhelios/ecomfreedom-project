import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'lodash';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { Paper, Typography, TextField, FormControl, TextareaAutosize, Fab } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import { getCourses } from 'redux/actions/courses';
import CourseSteps from 'components/Course/CourseSteps';
import {addPricingPlan} from "../../redux/actions/courses";

const styles = theme => ({
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
  title: {
    textAlign: 'center',
    marginBottom: 30
  },
  subtitle: {
    fontWeight: 'bold'
  },
  wrapper: {
    width: '100%',
    padding: 40,
    position: 'relative'
  },
  plan: {
    cursor: 'pointer'
  },
  margin: {
    margin: theme.spacing(1),
    width: '100%'
  },
  marginRow: {
    margin: theme.spacing(1),
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center'
  },
  form: {
    width: '60%',
    margin: 'auto'
  },
  fab: {
    background: 'orange',
    margin: '20px auto 0 !important',
    width: '100% !important',
    display: 'block',
  },
  textarea: {
    padding: '20px 14px',
    borderRadius: 4
  },
  backIcon: {
    color: '#bbb',
    position: 'absolute',
    left: 10,
    top: 10,
    padding: 10,
    cursor: 'pointer'
  }
});

const planTypes = [
  { id: 1, type: 'free', name: 'Free', description: 'No Payments', isRecurring: false },
  { id: 2, type: 'subscription', name: 'Subscription', description: 'Montly or Annual Billing', isRecurring: true },
  { id: 3, type: 'one-time', name: 'One-Time Purchase', description: 'A Single Payment', isRecurring: true },
  { id: 4, type: 'payment-plan', name: 'Payment Plan', description: 'A Fixed Number of Payments', isRecurring: true }
];

const initialState = {
  newPlan: null,
  price: 0,
  period: 1,
  title: '',
  subtitle: '',
  description: ''
};
class PricingPlans extends Component {
  state = {
    ...initialState
  };

  componentWillMount() {
    const { getCoursesAction } = this.props;
    getCoursesAction();
  }

  handleAddNew = item => () => {
    this.setState({ newPlan: item });
  };

  handleAddPlan = () => {
    const { match, addPricingPlanAction } = this.props;
    const { newPlan, price, title, subtitle, description, period } = this.state;
    const courseId = match && match.params && match.params.course;

    const payload = {
      price: parseFloat(price),
      courseId,
      isRecurring: newPlan.isRecurring,
      purchaseUrl: 'url',
      title,
      subtitle,
      description,
      period,
      type: newPlan.type
    };

    addPricingPlanAction(payload);
    this.setState({ ...initialState });
  };

  onChange = field => event => {
    let value = event && event.target && event.target.value;

    if (field === 'period' && value < 1) {
      value = 1;
    }

    this.setState({ [field]: value });
  };

  closeForm = () => {
    this.setState({ ...initialState })
  };

  renderNew = () => {
    const { classes } = this.props;
    const { newPlan, price, title, subtitle, description, period } = this.state;
    const type = newPlan && newPlan.type;

    return (
      <div className={classes.form}>
        <FormControl className={classes.margin}>
          <TextField
            fullWidth
            placeholder="Price"
            id="outlined-size-small"
            defaultValue="Small"
            variant="outlined"
            size="small"
            onChange={this.onChange('price')}
            value={price || ''}
          />
        </FormControl>
        {type === 'payment-plan'
          ? [
            <FormControl className={classes.marginRow}>
              <TextField
                style={{width: 'auto', marginRight: 16}}
                type="number"
                id="outlined-size-small"
                variant="outlined"
                size="small"
                onChange={this.onChange('period')}
                value={period}
              />
              <span>monthly payments</span>
            </FormControl>,
            <FormControl className={classes.margin}>
              <TextField
                fullWidth
                placeholder="Title"
                id="outlined-size-small"
                variant="outlined"
                size="small"
                onChange={this.onChange('title')}
                value={title}
              />
            </FormControl>,
            <FormControl className={classes.margin}>
              <TextField
              fullWidth
              placeholder="Subtitle"
              id="outlined-size-small"
              variant="outlined"
              size="small"
              onChange={this.onChange('subtitle')}
              value={subtitle}
              />
            </FormControl>,
            <FormControl className={classes.margin}>
              <TextareaAutosize
              className={classes.textarea}
              fullWidth
              aria-label="empty textarea"
              placeholder="Description"
              rows={6}
              onChange={this.onChange('description')}
              value={description}
              />
            </FormControl>,
          ]
          : null
        }
        <FormControl className={classes.margin}>
          <Fab
            className={classes.fab}
            variant="extended"
            color="default"
            size="medium"
            aria-label="like"
            onClick={this.handleAddPlan}
          >
            Add Pricing
          </Fab>
        </FormControl>
      </div>
    );
  };

  render() {
    const { classes, history, plans } = this.props;
    const { newPlan } = this.state;

    return (
      <>
        <AdminNavbar title="Pricing" />
        <AdminContent>
          <Paper classes={{ root: classes.wrapper }}>
            <Typography className={classes.title} variant="h6">
              {newPlan
                ? <div className={classes.backIcon}><ChevronLeft onClick={this.closeForm} /></div>
                : null
              }
              New Pricing Plan
            </Typography>
            <GridContainer>
              {newPlan
                ? this.renderNew()
                : map(planTypes, item => (
                  <GridItem key={item.id} xs={12} sm={6} md={4} lg={3} onClick={this.handleAddNew(item)} className={classes.plan}>
                    <Typography className={classes.subtitle}>{item.name}</Typography>
                    <Typography>{item.description}</Typography>
                  </GridItem>
                ))
              }
            </GridContainer>
          </Paper>
        </AdminContent>
        <CourseSteps active={3} history={history} />
      </>
    );
  }
}

PricingPlans.propTypes = {
  addPricingPlanAction: PropTypes.func.isRequired,
  getCoursesAction: PropTypes.func.isRequired,
  plans: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired
};

const mapStateToProps = ({ courses }) => ({
  plans: courses.course && courses.course.pricingPlans,
});

const mapDispatchToProps = dispatch => ({
  getCoursesAction: () => {
    dispatch(getCourses());
  },
  addPricingPlanAction: data => {
    dispatch(addPricingPlan(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PricingPlans));

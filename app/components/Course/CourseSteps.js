import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Done } from '@material-ui/icons';
import { withStyles, Typography } from '@material-ui/core';

const styles = {
  wrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    height: 44,
    background: '#1a8d81'
  },
  icon: {
    marginRight: 16,
    color: '#aaa'
  },
  iconDone: {
    marginLeft: 16,
    color: 'green'
  }
};

class CourseSteps extends Component {
  state = {
  };

  componentDidUpdate(prevProps) {
  }

  onChange = event => {
    this.setState({ title: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.wrap}>

      </div>
    );
  }
}

CourseSteps.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withStyles(styles)(CourseSteps);

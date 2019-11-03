/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Button from '@material-ui/core/Button';
import { push } from 'connected-react-router';
import routes from 'constants/routes.json';

export function HomePage({ pusher }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Ecom Freedom Homepage</h1>
      <Button variant="contained" color="primary" onClick={() => pusher(routes.LOGIN)}>
        Login
      </Button>
    </div>
  );
}

HomePage.propTypes = {
  pusher: PropTypes.func
};

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(
  mapStateToProps,
  { pusher: push }
);

export default compose(
  withConnect,
  memo
)(HomePage);

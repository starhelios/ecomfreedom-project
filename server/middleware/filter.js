const HttpStatus = require('http-status-codes');
const filter = require('../filter');
const validator = require('../validator');

module.exports = async (ctx, next) => {
  const paramNames = Object.keys(ctx.query);
  if (!validator.filters(ctx.query)) {
    ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
    ctx.body = { errors: validator.filters.errors };
    return;
  }
  const filtersInQuery = filter.findFilters(paramNames);
  if (filtersInQuery.length) {
    const promises = filtersInQuery.map(f => f.filter(ctx.query[f.name]));
    const conditions = (await Promise.all(promises)).filter(f => !!f);
    ctx.state.filter = { $and: conditions };
  } else {
    ctx.state.filter = {};
  }

  return next();
};

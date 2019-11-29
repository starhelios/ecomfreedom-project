const HttpStatus = require('http-status-codes');
const validator = require('../validator');

module.exports = DEFAULT_PAGE_SIZE => async (ctx, next) => {
  // eslint-disable-next-line prefer-const
  let { pageNumber, pageSize, ...fields } = ctx.query;
  pageNumber = pageNumber || '0';
  pageSize = pageSize || String(DEFAULT_PAGE_SIZE);

  if (!validator.pageRequest({ pageNumber, pageSize })) {
    ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
    ctx.body = { errors: validator.pageRequest.errors };
    return;
  }

  ctx.query = fields;
  const n = Number(pageNumber);
  const s = Number(pageSize);
  ctx.state.page = { limit: s, skip: s * n };

  next();
};

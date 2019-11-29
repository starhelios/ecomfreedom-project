const { JsonWebTokenError, TokenExpiredError, verify } = require('jsonwebtoken');
const config = require('../config');

const secret = config.get('web-app:secret');

export default async (ctx, next) => {
  let { auth = null } = ctx.query;
  if (!auth && ctx.request.headers.authorization) {
    const [type, token] = ctx.request.headers.authorization.split(' ');
    if (type === 'Bearer') {
      auth = token;
    }
  }

  if (auth) {
    try {
      ctx.state.auth = await verify(auth, secret);
      ctx.state.token = auth;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        ctx.status = 401;
        ctx.body = {
          error: 'Authorization token expired'
        };
        return;
      }
      if (error instanceof JsonWebTokenError) {
        ctx.status = 401;
        ctx.body = {
          error: 'Invalid authorization token'
        };
        return;
      }
      throw error;
    }
  }

  if (!(ctx.state && ctx.state.auth)) {
    ctx.status = 401;
    ctx.body = {
      error: 'Authorization token is required'
    };
    return;
  }

  return next();
};

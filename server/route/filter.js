const Router = require('koa-router');
const HttpStatus = require('http-status-codes');
const filter = require('../filter');

module.exports = app => {
  const router = new Router({ prefix: 'filter' });

  /**
   * @swagger
   *
   * /filter:
   *   get:
   *     description: returns all the filters
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: created a new role in DB
   *
   */
  router.get('/', async ctx => {
    ctx.status = HttpStatus.OK;
    ctx.body = filter.filters;
  });

  app.use(router.allowedMethods());
  app.use(router.routes());
};

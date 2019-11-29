const HttpStatus = require('http-status-codes');
const Router = require('koa-router');
const config = require('../config');
const createLogger = require('../logger');
const validator = require('../validator');
const db = require('../db');
const paginated = require('../middleware/page-request');
const filtered = require('../middleware/filter');
const { Role, Permission } = require('../middleware/authorizer');

const logger = createLogger('web-server.user-route');

module.exports = app => {
  const router = new Router({ prefix: 'user' });
  /**
   * @swagger
   * definitions:
   *   NewUser:
   *     type: object
   *     required:
   *       - password
   *       - email
   *     properties:
   *       username:
   *         type: string
   *         example: super
   *       password:
   *         type: string
   *         format: password
   *         example: awesomepassword
   *       email:
   *         type: string
   *         example: super@awesome.com
   *       firstname:
   *         type: string
   *         example: John
   *       lastname:
   *         type: string
   *         example: Doe
   *       roles:
   *         type: array
   *         items:
   *           type: string
   *           description: id or name of role
   *           example: admin
   *
   * /user:
   *   post:
   *     description: Login to the application
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: user
   *         description: New User object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/NewUser'
   *     responses:
   *       200:
   *         description: creates a new user in DB
   *       422:
   *         description: model does not satisfy the expected schema
   *       409:
   *         description: user with this username already exists
   *
   */
  router.post('/', async ctx => {
    const data = ctx.request.body;

    if (!validator.newUser(data)) {
      logger.error('validation of the new user failed', validator.newUser.errors);
      ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
      ctx.body = { errors: validator.newUser.errors };
      return;
    }

    const existing = await db.model.User.findOne({ email: data.email });
    if (existing) {
      logger.error('user', data.email, 'already exists');
      ctx.status = HttpStatus.CONFLICT;
      ctx.body = { errors: [{ dataPath: '.email', message: 'already exists' }] };
      return;
    }

    if (!data.roles) {
      data.roles = ['user'];
    }

    const allCreated = await db.model.Role.isCreated(data.roles);
    if (!allCreated) {
      logger.error('not all roles from', data.roles, 'have not been created yet');
      ctx.status = HttpStatus.CONFLICT;
      ctx.body = { errors: [{ dataPath: '.roles', message: `not created: ${data.roles}` }] };
      return;
    }

    data.roles = await db.model.Role.mapToId(data.roles);
    const user = await db.model.User.create(data);
    logger.info('user', user.email, 'has been created, id', String(user._id));
    ctx.status = HttpStatus.OK;
    ctx.body = {
      email: user.email,
      _id: user._id
    };
  });

  /**
   * @swagger
   * /user:
   *   get:
   *     parameters:
   *       - name: pageNumber
   *         in: query
   *         required: false
   *         default: 0
   *       - name: pageSize
   *         in: query
   *         required: false
   *         default: 20
   *       - name: last-login-after
   *         in: query
   *         default: 1
   *       - name: last-login-before
   *         in: query
   *         default: 2000000000000
   *       - name: login-count-greater-than
   *         in: query
   *         default: 1
   *       - name: signed-up-after
   *         in: query
   *         default: 1
   *       - name: signed-up-before
   *         in: query
   *         default: 2000000000000
   *       - name: has-role
   *         in: query
   *         default: user
   *     description: Get users
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: returns users
   *
   */
  router.get('/', paginated(20), filtered, async ctx => {
    const { filter, page } = ctx.state;
    const total = await db.model.User.countDocuments(filter);
    const data = await db.model.User.find(filter)
      .limit(page.limit)
      .skip(page.skip)
      .populate({ path: 'roles', populate: { path: 'permissions', model: 'permission' } });
    ctx.status = HttpStatus.OK;
    ctx.body = {
      total,
      data
    };
  });

  if (config.get('NODE_ENV') === 'test') {
    router.get('/test-users-only', Role('test-role'), async ctx => {
      ctx.body = true;
    });

    router.get('/admin-users-only', Role('admin-role'), async ctx => {
      ctx.body = true;
    });

    router.get('/test-permission-only', Permission('test-permission'), async ctx => {
      ctx.body = true;
    });

    router.get('/write-permission-only', Permission('write'), async ctx => {
      ctx.body = true;
    });
  }

  app.use(router.allowedMethods());
  app.use(router.routes());
};

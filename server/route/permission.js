const HttpStatus = require('http-status-codes');
const Router = require('koa-router');
const createLogger = require('../logger');
const validator = require('../validator');
const db = require('../db');
const paginated = require('../middleware/page-request');
const logger = createLogger('web-server.permission-route');

module.exports = app => {
  const router = new Router({ prefix: 'permission' });
  /**
   * @swagger
   * definitions:
   *   Permission:
   *     type: object
   *     properties:
   *       id:
   *         type: string
   *         example: 5db43b325abc9302f46fe9ba
   *       name:
   *         type: string
   *         example: read-write
   *       description:
   *         type: string
   *         example: read write permission
   *
   * /permission:
   *   post:
   *     description: updates or creates a new permission
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: permission
   *         description: New Permission object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/Permission'
   *     responses:
   *       200:
   *         description: created a new permission in DB
   *       422:
   *         description: model does not satisfy the expected schema
   *       409:
   *         description: permission with this name already exists
   *
   */
  router.post('/', async ctx => {
    const data = ctx.request.body;
    if (!validator.newPermission(data)) {
      logger.error('validation of the new permission failed', validator.newPermission.errors);
      ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
      ctx.body = { errors: validator.newPermission.errors };
      return;
    }

    if (!data.id) {
      // new permission flow - check the name
      const existing = await db.model.Permission.findOne({ name: data.name });
      if (existing) {
        logger.error('permission', data.name, 'already exists');
        ctx.status = HttpStatus.CONFLICT;
        ctx.body = { errors: [{ dataPath: '.name', message: 'already exists' }] };
        return;
      }
    }

    const permission = await db.model.Permission.create(data);
    logger.info('permission', permission.name, 'has been created/updated, id', String(permission._id));
    ctx.status = HttpStatus.OK;
    ctx.body = permission;
  });

  /**
   * @swagger
   * /permission/{name}:
   *   delete:
   *     parameters:
   *       - name: name
   *         description: id or name to delete
   *         in: path
   *     description: deletes the permission and removes assigned permissions from Roles
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: returns deleted roles count - 1/0
   *       422:
   *         description: no id provided
   *
   */
  router.delete('/:name', async ctx => {
    const data = ctx.params;

    if (!validator.name(data)) {
      logger.error('validation of permission delete request failed', validator.name.errors);
      ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
      ctx.body = { errors: validator.name.errors };
      return;
    }

    const permissionId = await db.model.Permission.mapOneToId(data.name);
    const { nModified } = await db.model.Role.update({}, { $pull: { permissions: permissionId } }, { multi: true });
    logger.info('roles changed', nModified);

    const result = await db.model.Permission.deleteOne({ _id: permissionId });
    if (result.deletedCount) {
      logger.info('permission, id/name', data.name, 'has been deleted');
    } else {
      /* istanbul ignore next */
      logger.error('could not delete permission, id/name', data.name);
    }
    ctx.status = HttpStatus.OK;
    ctx.body = { deleted: result.deletedCount };
  });

  /**
   * @swagger
   * /permission:
   *   get:
   *     parameters:
   *       - name: pageNumber
   *         in: query
   *         required: false
   *         default: 0
   *       - name: pageSize
   *         in: query
   *         required: false
   *         default: 1000
   *     description: Get all the permissions
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: returns permissions
   *
   */
  router.get('/', paginated(1000), async ctx => {
    const { page } = ctx.state;
    const total = await db.model.Permission.countDocuments();
    const data = await db.model.Permission.find()
      .limit(page.limit)
      .skip(page.skip);
    ctx.status = HttpStatus.OK;
    ctx.body = {
      total,
      data
    };
  });

  /**
   * @swagger
   * /permission/{name}:
   *   get:
   *     parameters:
   *       - name: name
   *         description: id or name to get
   *         in: path
   *     description: Get the permission object
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: returns permission object or null if not found
   *       422:
   *         description: id or name is wrong
   *
   */
  router.get('/:name', async ctx => {
    const { params } = ctx;

    if (!validator.name(params)) {
      logger.error('validation of get request failed', validator.name.errors);
      ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
      ctx.body = { errors: validator.name.errors };
      return;
    }

    const permissionId = await db.model.Permission.mapOneToId(params.name);
    const result = await db.model.Permission.findById(permissionId);
    ctx.status = HttpStatus.OK;
    ctx.body = result;
  });

  app.use(router.allowedMethods());
  app.use(router.routes());
};

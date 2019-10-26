const express = require('express');
const createLogger = require('../logger');
const validator = require('../validator');
const db = require('../db');

const router = express.Router();
const logger = createLogger('web-server.permission-route');

/**
 * @swagger
 * definitions:
 *   Permission:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       description:
 *         type: string
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
router.post('/', async (req, res) => {
  const data = req.body;
  if (!validator.newPermission(data)) {
    logger.error('validation of the new permission failed', validator.newPermission.errors);
    res.status(422).json({ errors: validator.newPermission.errors });
    return;
  }

  if (!data.id) {
    // new permission flow - check the name
    const existing = await db.model.Permission.findOne({ name: data.name });
    if (existing) {
      logger.error('permission', data.name, 'already exists');
      res.status(409).json({ errors: [{ dataPath: '.name', message: 'already exists' }] });
      return;
    }
  }

  const permission = await db.model.Permission.create(data);
  logger.info('permission', permission.name, 'has been created/updated, id', String(permission._id));
  res.json(permission);
});

/**
 * @swagger
 * definitions:
 *   DeletePermissionRequest:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *
 * /permission:
 *   delete:
 *     description: deletes the permission and removes assigned permissions from Roles
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: role
 *         description: id
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/DeletePermissionRequest'
 *     responses:
 *       200:
 *         description: returns deleted roles count - 1/0
 *       422:
 *         description: no id provided
 *
 */
router.delete('/', async (req, res) => {
  const data = req.body;

  if (!validator.mongoId(data)) {
    logger.error('validation of permission delete request failed', validator.mongoId.errors);
    res.status(422).json({ errors: validator.mongoId.errors });
    return;
  }

  const { nModified } = await db.model.Role.update({}, { $pull: { permissions: data.id } }, { multi: true });
  logger.info('roles changed', nModified);

  const result = await db.model.Permission.deleteOne({ _id: data.id });
  if (result.deletedCount) {
    logger.info('permission, id', data.id, 'has been deleted');
  } else {
    logger.error('could not delete permission, id', data.id);
  }
  res.json({ deleted: result.deletedCount });
});

module.exports = router;

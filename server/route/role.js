const express = require('express');
const createLogger = require('../logger');
const validator = require('../validator');
const db = require('../db');

const router = express.Router();
const logger = createLogger('web-server.role-route');

/**
 * @swagger
 * definitions:
 *   Role:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       permissions:
 *         type: array
 *         items:
 *           type: string
 *
 * /role:
 *   post:
 *     description: updates or creates a new role
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: role
 *         description: New Role object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Role'
 *     responses:
 *       200:
 *         description: created a new role in DB
 *       422:
 *         description: model does not satisfy the expected schema
 *       409:
 *         description: role with this name already exists
 *
 */
router.post('/', async (req, res) => {
  const data = req.body;

  if (!validator.newRole(data)) {
    logger.error('validation of the new role failed', validator.newRole.errors);
    res.status(422).json({ errors: validator.newRole.errors });
    return;
  }

  if (!data.id) {
    // new role - check the name
    const existing = await db.model.Role.findOne({ name: data.name });
    if (existing) {
      logger.error('role', data.name, 'already exists');
      res.status(409).json({ errors: [{ dataPath: '.name', message: 'already exists' }] });
      return;
    }
  }

  const notCreatedPermissions = await db.model.Permission.findNotCreatedPermissions(data.permissions);
  if (notCreatedPermissions.length) {
    logger.error('permissions', notCreatedPermissions, 'have not been created yet');
    res
      .status(409)
      .json({ errors: [{ dataPath: '.permissions', message: `not created, ids: ${notCreatedPermissions}` }] });
    return;
  }

  const role = await db.model.Role.create(data);
  logger.info('role', role.name, 'has been created/updated, id', String(role._id));
  res.json(role);
});

/**
 * @swagger
 * definitions:
 *   DeleteRoleRequest:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *
 * /role:
 *   delete:
 *     description: deletes the role
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
 *           $ref: '#/definitions/DeleteRoleRequest'
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
    logger.error('validation of role delete request failed', validator.mongoId.errors);
    res.status(422).json({ errors: validator.mongoId.errors });
    return;
  }

  const result = await db.model.Role.deleteOne({ _id: data.id });
  if (result.deletedCount) {
    logger.info('role, id', data.id, 'has been deleted');
  } else {
    logger.error('could not delete role, id', data.id);
  }
  res.json({ deleted: result.deletedCount });
});

module.exports = router;

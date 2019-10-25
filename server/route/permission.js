const express = require('express');
// const createLogger = require('../logger');
// const validator = require('../validator');
// const db = require('../db');

const router = express.Router();
// const logger = createLogger('web-server.permission-route');

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
 *       rule:
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
 *       - name: role
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
  res.json(data);
});

module.exports = router;

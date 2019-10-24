const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const createLogger = require('../logger');
const validator = require('../validator');

const router = express.Router();
const SECRET = config.get('web-app:secret');
const logger = createLogger('web-server.user-route');

/**
 * @swagger
 * definitions:
 *   UserCredentials:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *
 * /user/login:
 *   post:
 *     description: Login to the application
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/UserCredentials'
 *     responses:
 *       200:
 *         description: login
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).end();
  }
  if (username === 'test' && password === 'pass') {
    logger.info(
      'user',
      username,
      'authenticated successfully, creating tokens'
    );
    const token = jwt.sign({ username }, SECRET, {
      expiresIn: config.get('web-app:token-expires-in')
    });
    const refreshToken = jwt.sign({ username }, SECRET, {
      expiresIn: config.get('web-app:refresh-token-expires-in')
    });
    return res.json({ token, refreshToken });
  }
  return res.status(401).end();
});

/**
 * @swagger
 * definitions:
 *   NewUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *       - email
 *       - firstname
 *       - lastname
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *       email:
 *         type: string
 *       firstname:
 *         type: string
 *       lastname:
 *         type: string
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
 *         description: stores a new user in DB
 */
router.post('/', (req, res) => {
  if (!validator.newUser(req.body)) {
    logger.error('validation of the new user failed', validator.newUser.errors);
    res.status(400).json({ errors: validator.newUser.errors });
  }
  res.status(200).end();
});

module.exports = router;

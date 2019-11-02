const expressJwt = require('express-jwt');
const config = require('./config');
const SECRET = config.get('web-app:secret');

function Role(...authorizedRoles) {
  return [
    expressJwt({ secret: SECRET }),
    async (req, res, next) => {
      const { roles } = req.user;
      if (authorizedRoles.some(authorizedRole => roles.includes(authorizedRole))) {
        return next();
      }
      return res.status(401).json({ message: 'Unauthorized' });
    }
  ];
}

function Permission(...authorizedPermissions) {
  return [
    expressJwt({ secret: SECRET }),

    async (req, res, next) => {
      const { permissions } = req.user;
      if (permissions.include('*')) {
        return next();
      }
      if (authorizedPermissions.some(authorizedPermission => permissions.includes(authorizedPermission))) {
        return next();
      }
      return res.status(401).json({ message: 'Unauthorized' });
    }
  ];
}

module.exports = { Role, Permission };
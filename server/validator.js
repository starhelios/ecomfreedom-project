const Ajv = require('ajv');
const { readJson } = require('./file-util');

const ajv = new Ajv({ schemaId: 'auto', allErrors: true });
ajv.addSchema(readJson('schema', 'name.schema.json'));

const newUserSchema = readJson('schema', 'new-user.schema.json');
const newRolePermissionSchema = readJson('schema', 'new-role-permission.schema.json');
const newUser = ajv.compile(newUserSchema);
const newRolePermission = ajv.compile(newRolePermissionSchema);

module.exports = {
  newUser,
  newRolePermission
};

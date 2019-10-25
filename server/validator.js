const Ajv = require('ajv');
const { readJson } = require('./file-util');

const ajv = new Ajv({ schemaId: 'auto', allErrors: true });
ajv.addSchema(readJson('schema', 'role.schema.json'));

const newUserSchema = readJson('schema', 'new-user.schema.json');
const newRoleSchema = readJson('schema', 'new-role.schema.json');
const newUser = ajv.compile(newUserSchema);
const newRole = ajv.compile(newRoleSchema);

module.exports = {
  newUser,
  newRole
};

const Ajv = require('ajv');
const ajv = new Ajv({ schemaId: 'auto', allErrors: true });

const ENV = 'NODE_ENV';
const nconf = require('nconf');
const { readJson } = require('./file-util');
nconf
  .use('memory')
  .argv()
  .env()
  .required([ENV]);

const env = nconf.get(ENV);
// const data = env === 'production' ? prod : dev;
const data = require(`../config/${env}.js`);
ajv.addSchema(readJson('schema', 'filter.schema.json'));
const schema = readJson('schema', 'config.schema.json');
const validate = ajv.compile(schema);

if (!validate(data)) {
  // eslint-disable-next-line no-console
  console.error('Bot configuration does not match the JSON schema');
  // eslint-disable-next-line no-console
  console.error(validate.errors);
  process.exit(401);
}

// eslint-disable-next-line no-console
console.info('starting with the env:', env);
nconf.overrides(data);
// eslint-disable-next-line no-console
console.info('mongo host:', nconf.get('mongo:host'));
// eslint-disable-next-line no-console
console.info('database:', nconf.get('mongo:db'));

nconf.set('mode:dev', env === 'development');
nconf.set(
  'db:url',
  `mongodb+srv://${env === 'production' ? `${nconf.get('mongo:user')}:${nconf.get('mongo:password')}@` : ''}${nconf.get(
    'mongo:host'
  )}/${nconf.get('mongo:db')}?retryWrites=true&w=majority`
);
module.exports = nconf;

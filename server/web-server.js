const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const convert = require('koa-convert');
const mount = require('koa-mount');
const swaggerUi = require('swagger-ui-koa');

const swaggerSpec = require('./swagger');
const config = require('./config');
const createLogger = require('./logger');
const logger = createLogger('web-server');
const app = new Koa();

app.use(bodyParser());
app.use(swaggerUi.serve);
app.use(convert(mount('/api/v1/api-docs', swaggerUi.setup(swaggerSpec))));

require('./route/course')(app);
require('./route/filter')(app);
require('./route/oauth')(app);
require('./route/permission')(app);
require('./route/pricing-plan')(app);
require('./route/role')(app);
require('./route/user')(app);

const port = config.get('web-app:port');

/* istanbul ignore next */
if (config.get('NODE_ENV') === 'production') {
  // production mode
  app.use(serve(path.join(__dirname, '..', 'build')));
  app.listen(port, () => logger.info('web server started in production, port', port));
} else if (config.get('NODE_ENV') === 'development') {
  // npm: run dev script to start
  // then web-server
  // eslint-disable-next-line global-require
  require('./web-server.dev')(app, port);
} else if (config.get('NODE_ENV') === 'test') {
  module.exports = app;
} else {
  throw new Error('not supported app mode!');
}

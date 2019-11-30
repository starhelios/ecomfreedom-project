const { resolve } = require('path');
const ngrok = require('ngrok');
const Router = require('koa-router');
const setup = require('./middlewares/frontendMiddleware');
const createLogger = require('./logger');
const logger = createLogger('web-server.dev');

module.exports = (app, port) => {
  // If you need a backend, e.g. an API, add your custom backend-specific middleware here
  // app.use('/api', myApi);

  // In production we need to pass these values in instead of relying on webpack
  setup(app, {
    outputPath: resolve(process.cwd(), 'build'),
    publicPath: '/'
  });

  // use the gzipped bundle
  const router = new Router();

  router.get('*.js', async (ctx, next) => {
    ctx.url = ctx.req.url + '.gz'; // eslint-disable-line
    ctx.set('Content-Encoding', 'gzip');
    await next();
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(port, async () => {
    try {
      const url = await ngrok.connect(port);
      logger.info('dev web server started', url, port);
    } catch (e) {
      return logger.error(e);
    }
  });
};

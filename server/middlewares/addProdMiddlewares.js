const path = require('path');
const compression = require('koa-compress');
const serve = require('koa-static');
const send = require('koa-send');

module.exports = function addProdMiddlewares(app, options) {
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');
  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression());
  app.use(serve(outputPath));

  app.use(async ctx => send(ctx, ctx.path, { root: path.resolve(outputPath, 'index.html') }));
};

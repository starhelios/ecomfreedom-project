const path = require('path');
const webpack = require('webpack');
const HttpStatus = require('http-status-codes');
const send = require('koa-send');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

function createWebpackMiddleware(compiler, publicPath) {
  return webpackDevMiddleware(compiler, {
    logLevel: 'warn',
    publicPath,
    silent: true,
    stats: 'errors-only'
  });
}

module.exports = function addDevMiddlewares(app, webpackConfig) {
  const compiler = webpack(webpackConfig);
  const middleware = createWebpackMiddleware(compiler, webpackConfig.output.publicPath);

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem;

  app.use(async ctx => {
    const _path = path.join(compiler.outputPath, 'index.html');
    fs.readFile(_path, async err => {
      if (err) {
        ctx.status = HttpStatus.NOT_FOUND;
      } else {
        await send(ctx, ctx.path, { root: _path });
      }
    });
  });
  //
  // app.get('*', (req, res) => {
  //   fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
  //     if (err) {
  //       res.sendStatus(404);
  //     } else {
  //       res.send(file.toString());
  //     }
  //   });
  // });
};

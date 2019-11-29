const HttpStatus = require('http-status-codes');
const Router = require('koa-router');
const validator = require('../validator');
const createLogger = require('../logger');
const logger = createLogger('web-server.course-route');
const db = require('../db');

module.exports = app => {
  const router = new Router({ prefix: 'pricing-plan' });
  /**
   * @swagger
   * definitions:
   *   PricingPlan:
   *     type: object
   *     properties:
   *       id:
   *         type: string
   *         example: 5db3f8d7075794205c8d1c31
   *       amount:
   *         type: number
   *         example: 100
   *         required: true
   *       title:
   *         type: string,
   *         example: Test pricing plan
   *         required: true
   *       subtitle:
   *         type: string
   *         example: the way you choose to pay
   *         required: true
   *       description:
   *        type: string
   *        example: the way you choose to pay
   *       type:
   *        type: string
   *        enum: [free, subscription, one-time, pricing-plan]
   *        example: one-time
   *
   * /pricing-plan:
   *   post:
   *     description: updates or creates a new pricing plan
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: plan
   *         description: New Plan object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/PricingPlan'
   *     responses:
   *       200:
   *         description: created a new plan in DB
   *       422:
   *         description: model does not satisfy the expected schema
   *
   */
  router.post('/', async ctx => {
    const data = ctx.request.body;

    if (!validator.pricingPlan(data)) {
      logger.error('validation of create pricing plan request failed', validator.pricingPlan.errors);
      ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
      ctx.body = { errors: validator.pricingPlan.errors };
      return;
    }

    const plan = await db.model.PricingPlan.create(data);
    logger.info('pricing plan', plan.title, 'has been created/updated, id', String(plan._id));
    ctx.status = HttpStatus.OK;
    ctx.body = plan;
  });
  app.use(router.allowedMethods());
  app.use(router.routes());
};

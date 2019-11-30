const Router = require('koa-router');
const HttpStatus = require('http-status-codes');
const multer = require('@koa/multer');
const validator = require('../validator');
const createLogger = require('../logger');
const logger = createLogger('web-server.course-route');
const db = require('../db');
const paginated = require('../middleware/page-request');
const upload = multer({ storage: multer.memoryStorage() });

module.exports = app => {
  const router = new Router({ prefix: '/api/v1/course' });
  /**
   * @swagger
   * definitions:
   *   Course:
   *     type: object
   *     properties:
   *       id:
   *         type: string,
   *         example: 5db3f8d7075794205c8d1c31
   *       title:
   *         type: string,
   *         example: Angular 8
   *         required: true
   *       subtitle:
   *         type: string,
   *         example: Get Started
   *         required: true
   *       authors:
   *         required: true
   *         type: array
   *         items:
   *           type: string
   *           example: admin@gmail.com
   *           description: id, username or email as a user key
   *
   * /course:
   *   post:
   *     description: updates or creates a new course
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: course
   *         description: New Course object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/Course'
   *     responses:
   *       200:
   *         description: created a new course in DB
   *       409:
   *         description: not all authors have been created
   *       422:
   *         description: model does not satisfy the expected schema
   *
   */
  router.post('/', async ctx => {
    const data = ctx.request.body;
    if (!validator.course(data)) {
      logger.error('validation of create course request failed', validator.course.errors);
      ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
      ctx.body = { errors: validator.course.errors };
      return;
    }
    const authorsCreated = await db.model.User.verifyEmails(data.authors);
    if (!authorsCreated) {
      logger.error('authors', data.authors, 'have not been created yet');
      ctx.status = HttpStatus.CONFLICT;
      ctx.body = { errors: [{ dataPath: '.authors', message: `not created: ${data.authors}` }] };
      return;
    }

    data.authors = await db.model.User.mapToId(data.authors);
    const course = await db.model.Course.create(data);
    const sectionCount = await course.createSection({ title: 'First section' });
    await course.createLecture(sectionCount - 1, { title: 'First lecture', status: 'draft' });
    logger.info('course', course.title, 'has been created/updated, id', String(course._id));
    ctx.body = course;
  });

  /**
   * @swagger
   * definitions:
   *   Section:
   *     type: object
   *     properties:
   *       index:
   *         type: number,
   *         example: 0
   *         description: index of section to update
   *       title:
   *         type: string,
   *         example: Get started
   *         required: true
   * /course/{course}/section:
   *   post:
   *     description: updates or creates a new section
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: course
   *         in: path
   *       - name: section
   *         description: New section
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/Section'
   *     responses:
   *       200:
   *         description: created a new course in DB
   *       409:
   *         description: course id does not exist
   *       422:
   *         description: model does not satisfy the expected schema
   * /course/{course}/section/{section}:
   *   delete:
   *    description: delete section from a course
   *    consumes:
   *      - application/json
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: course
   *        in: path
   *        required: true
   *        type: string
   *        schema:
   *          $ref: '#/definitions/Course'
   *      - name: section
   *        in: path
   *        required: true
   *        type: string
   *        schema:
   *          $ref: '#/definitions/Section'
   *    responses:
   *      202:
   *        description: section is soft deleted
   *      404:
   *        description: section or course is not found by specified id
   *      500:
   *        description: internal server error
   */
  router.post('/:course/section', async ctx => {
    const {
      request: { body },
      params
    } = ctx;
    if (!validator.courseSection({ body, params })) {
      logger.error('validation of create course section request failed', validator.courseSection.errors);
      ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
      ctx.body = { errors: validator.courseSection.errors };
      return;
    }

    const course = await db.model.Course.findById(params.course);
    if (!course) {
      logger.error('course not found, id', params.course);
      ctx.status = HttpStatus.CONFLICT;
      ctx.body = { errors: [{ dataPath: 'course.id', message: 'course not found for provided id' }] };
      return;
    }
    const sectionCount = await course.createSection(body);
    ctx.status = HttpStatus.OK;
    ctx.body = { sectionCount };
  });

  router.delete('/:course/section/:section', async ctx => {
    const { params } = ctx;
    if (!validator.deleteSection({ params })) {
      logger.error('validation of create course section request failed', validator.deleteSection.errors);
      ctx.status = HttpStatus.BAD_REQUEST;
      ctx.body = { errors: validator.deleteSection.errors };
      return;
    }

    const course = await db.model.Course.findById(params.course);
    if (!course) {
      ctx.status = HttpStatus.NOT_FOUND;
      ctx.body = { errors: `Course with id ${params.course} is not found` };
      return;
    }

    try {
      const _course = await course.deleteSection(params.section);
      ctx.status = HttpStatus.ACCEPTED;
      ctx.body = { course: _course };
    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = { errors: error.message };
    }
  });
  /**
   * @swagger
   * definitions:
   *   Lecture:
   *     type: object
   *     properties:
   *       index:
   *         type: number,
   *         example: 0
   *         description: index of lecture to update
   *       title:
   *         type: string,
   *         example: Get started
   *         required: true
   *       file:
   *         type: string,
   *         example: file
   *         required: true
   *       image:
   *         type: string,
   *         example: image
   *         required: true
   *       text:
   *         type: string,
   *         example: lecture text
   *         required: true
   *       allowComments:
   *         type: boolean,
   *         example: true
   *         required: true
   *       state:
   *         type: string,
   *         enum: [active,draft]
   *         required: true
   * /course/{course}/section/{section}/lecture:
   *   post:
   *     description: updates or creates a new lecture
   *     consumes:
   *       - application/json
   *       - multipart/form-data
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: course
   *         in: path
   *       - name: section
   *         in: path
   *       - name: lecture
   *         description: New lecture
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/Lecture'
   *     responses:
   *       200:
   *         description: created a new lecture in DB
   *       409:
   *         description: course id does not exist
   *       422:
   *         description: model does not satisfy the expected schema
   * /course/{course}/section/{section}/lecture/{lecture}:
   *   delete:
   *    description: delete lecture from a section
   *    consumes:
   *      - application/json
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: course
   *        in: path
   *        required: true
   *        type: string
   *        schema:
   *          $ref: '#/definitions/Course'
   *      - name: section
   *        in: path
   *        required: true
   *        type: string
   *        schema:
   *          $ref: '#/definitions/Section'
   *      - name: lecture
   *        in: path
   *        required: true
   *        type: string
   *        schema:
   *          $ref: '#/definitions/Lecture'
   *    responses:
   *      202:
   *        description: lecture is deleted
   *      404:
   *        description: section or lecture is not found by specified id
   *      500:
   *        description: internal server error
   */
  router.post('/:course/section/:section/lecture', upload.single('file'), async ctx => {
    const { body, params, file } = ctx;

    if (!validator.courseLecture({ body, params })) {
      logger.error('validation of create course lecture request failed', validator.courseLecture.errors);
      ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
      ctx.body = { errors: validator.courseLecture.errors };
      return;
    }

    const course = await db.model.Course.findById(params.course);
    if (!course) {
      logger.error('course not found, id', params.course);
      ctx.status = HttpStatus.CONFLICT;
      ctx.body = { errors: [{ dataPath: 'course.id', message: 'course not found for provided id' }] };
      return;
    }
    if (params.section >= course.sections.length) {
      logger.error('section does not exist, index', params.section);
      ctx.status = HttpStatus.CONFLICT;
      ctx.body = {
        errors: [{ dataPath: 'section.index', message: `section does not exist, index ${params.section}` }]
      };
      return;
    }
    const { lectureCount, image, file: uploadedVideo } = await course.createLecture(params.section, body, file);
    ctx.status = HttpStatus.OK;
    ctx.body = {
      file: uploadedVideo,
      lectureCount,
      image
    };
  });

  router.delete('/:course/section/:section/lecture/:lecture', async ctx => {
    const { params } = ctx;

    if (!validator.deleteLecture({ params })) {
      const { errors } = validator.deleteLecture;
      logger.error('Validation of delete lecture request is failed', errors);
      ctx.status = HttpStatus.BAD_REQUEST;
      ctx.body = { errors };
    }

    const course = await db.model.Course.findById(params.course);

    if (!course) {
      ctx.status = HttpStatus.NOT_FOUND;
      ctx.body = { errors: `Course with id ${params.course} is not found` };
    }

    try {
      const _course = await course.deleteLecture(params.section, params.lecture);
      ctx.status = HttpStatus.ACCEPTED;
      ctx.body = { course: _course };
    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = { errors: error.message };
    }
  });
  /**
   * @swagger
   * /course:
   *   get:
   *     parameters:
   *       - name: pageNumber
   *         in: query
   *         required: false
   *         default: 0
   *       - name: pageSize
   *         in: query
   *         required: false
   *         default: 20
   *     description: Get all the courses
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: returns courses
   *
   */
  router.get('/', paginated(20), async ctx => {
    const { page, filter } = ctx.state;
    const total = await db.model.Course.countDocuments(filter);
    const data = await db.model.Course.find(filter)
      .limit(page.limit)
      .skip(page.skip);
    ctx.status = HttpStatus.OK;
    ctx.body = { total, data };
  });
  /**
   * @swagger
   * /course/{course}:
   *  get:
   *    description: get course by mongo id
   *    consumes:
   *      - application/json
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: course
   *        in: path
   *        required: true
   *        type: string
   *        schema:
   *          $ref: '#/definitions/Course'
   *    responses:
   *      200:
   *        description: course by id is found
   *      400:
   *        description: no course in url path
   *      404:
   *        description: no course in mongodb
   *  delete:
   *    description: delete course by mongo id
   *    consumes:
   *      - application/json
   *    produces:
   *      - application/json
   *    parameters:
   *      - name: course
   *        in: path
   *        required: true
   *        type: string
   *        schema:
   *          $ref: '#/definitions/Course'
   *    responses:
   *      202:
   *        description: course is deleted
   *      404:
   *        description: course is not found by specified id
   *      500:
   *        description: internal server error
   */
  router.get('/:course', async ctx => {
    const { params } = ctx;
    if (!validator.getCourse({ params })) {
      const { errors } = validator.getCourse;
      logger.error('Validation of get course request is failed', errors);
      ctx.status = HttpStatus.BAD_REQUEST;
      ctx.body = { errors };
      return;
    }

    const course = await db.model.Course.findById(params.course);

    if (!course) {
      ctx.status = HttpStatus.NOT_FOUND;
      ctx.body = { error: `Course with id ${params.course} is not found` };
      return;
    }
    ctx.status = HttpStatus.OK;
    ctx.body = course;
  });

  router.delete('/:course', async ctx => {
    const { params } = ctx;
    if (!validator.getCourse({ params })) {
      const { errors } = validator.getCourse;
      logger.error('Validation of get course request is failed', errors);
      ctx.status = HttpStatus.BAD_REQUEST;
      ctx.body = { errors };
      return;
    }
    try {
      const course = await db.model.Course.deleteCourse(params.course);
      ctx.status = HttpStatus.ACCEPTED;
      ctx.body = { course };
    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = {
        errors: error.message
      };
    }
  });

  app.use(router.allowedMethods());
  app.use(router.routes());
};

const validator = require('../validator');

module.exports = async (req, res, next) => {
  const { pageNumber, pageSize, ...fields } = req.query;

  if (!validator.pageRequest({ pageNumber, pageSize })) {
    res.status(422).json({ errors: validator.pageRequest.errors });
    return;
  }

  req.query = fields;
  req.page = { number: Number(pageNumber), size: Number(pageSize) };

  next();
};

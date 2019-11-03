const validator = require('../validator');

module.exports = async (req, res, next) => {
  const data = req.query;

  if (!validator.pageRequest(data)) {
    res.status(422).json({ errors: validator.pageRequest.errors });
    return;
  }
  // eslint-disable-next-line radix
  req.query = { pageNumber: parseInt(data.pageNumber), pageSize: parseInt(data.pageSize) };

  next();
};

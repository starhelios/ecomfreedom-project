module.exports = {
  label: 'Last login before',
  filter(date) {
    return [{ $match: { lastLogin: { $lte: date } } }];
  }
};

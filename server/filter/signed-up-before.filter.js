module.exports = {
  label: 'Signed up before',
  filter(date) {
    return [{ $match: { signed: { $lte: date } } }];
  }
};

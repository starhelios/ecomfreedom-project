module.exports = {
  label: 'Signed up after',
  filter(date) {
    return [{ $match: { signed: { $gte: date } } }];
  }
};

module.exports = {
  label: 'Last login after',
  filter(date) {
    return [{ $match: { lastLogin: { $gte: date } } }];
  }
};

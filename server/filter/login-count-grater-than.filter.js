module.exports = {
  label: 'Login count greater than',
  filter(count) {
    return [{ $match: { loginCount: { $gte: count } } }];
  }
};

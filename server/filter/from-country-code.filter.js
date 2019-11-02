module.exports = {
  label: 'From country code',
  filter(code) {
    return [{ $match: { countryCode: code } }];
  }
};

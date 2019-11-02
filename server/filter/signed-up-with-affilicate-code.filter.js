module.exports = {
  label: 'Signed up with affiliate code',
  filter(code) {
    return [{ $match: { signAffiliateCode: code } }];
  }
};

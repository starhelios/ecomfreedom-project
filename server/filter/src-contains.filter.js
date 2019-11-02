module.exports = {
  label: 'Src contains',
  filter(inclusion) {
    const re = new RegExp(inclusion);
    return [{ $match: { src: re } }];
  }
};

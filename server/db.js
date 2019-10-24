const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config');

mongoose.Promise = Promise;
mongoose.connect(config.get('db:url'), { useNewUrlParser: true });

const USER = new mongoose.Schema({
  username: { type: String, unique: true },
  hash: String,
  email: String,
  firstname: String,
  lastname: String
});

USER.statics.create = async ({
  username,
  password,
  email,
  firstname,
  lastname
}) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = new User({ username, hash, email, firstname, lastname });
  await user.save();
  return user;
};

const User = mongoose.model('user', USER);

module.exports = {
  model: {
    User
  }
};

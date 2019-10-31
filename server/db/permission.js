const mongoose = require('mongoose');
const { DEFAULT_OPTIONS } = require('./common');

const PERMISSION = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    description: String
  },
  DEFAULT_OPTIONS
);

PERMISSION.statics.createIfNotExists = async name => {
  const permission = await Permission.findOne({ name });
  if (permission) {
    return permission;
  }
  return Permission.create({ name, description: '' });
};

PERMISSION.statics.create = async ({ id, name, description }) => {
  let permission;
  if (id) {
    permission = await Permission.findById(id);
    permission.name = name;
    permission.description = description;
  } else {
    permission = new Permission({ name, description });
  }
  return permission.save();
};

PERMISSION.statics.findNotCreatedPermissions = async permissions => {
  const select = await Permission.find({ _id: { $in: permissions } }).select({ _id: 1 });
  const created = select.map(({ _id }) => String(_id));
  return permissions.filter(p => !created.includes(p));
};

const Permission = mongoose.model('permission', PERMISSION);

module.exports = Permission;

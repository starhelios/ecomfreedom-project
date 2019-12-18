const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { DEFAULT_OPTIONS } = require('./common');
const { error404 } = require('../util');
const User = require('./user');

/* eslint-disable */
const INTERNAl_COMMENT = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: 'user', required: true },
    content: { type: String, required: true },
    commentator: { type: ObjectId, ref: 'user', required: true },
    created: Date
  },
  DEFAULT_OPTIONS
);

INTERNAl_COMMENT.statics.create = async args => {
  const [target, commentator] = await Promise.all([User.findById(args.user), User.findById(args.commentator)]);
  if (!target) throw error404(target, args.user);
  if (!commentator) throw error404(commentator, args.commentator);

  const comment = await new InternalComment({ created: new Date(), ...args }).save();
  await target.addNote(comment._id);
  return comment;
};

const InternalComment = mongoose.model('internal-comment', INTERNAl_COMMENT);

module.exports = InternalComment;
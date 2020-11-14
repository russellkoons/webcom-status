'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const statusSchema = mongoose.Schema({
  user: String,
  tasks: Array,
  audits: Array,
  enhancements: Array,
  builds: Array,
  uploads: Number,
  tickets: Number,
  workflows: Number,
  reports: Number,
  mobileUpdates: Number,
  pageAudits: Number,
  auditEnhancements: Number,
});

statusSchema.methods.serialize = () => {
  return {
    id: this._id,
    user: this.user,
    tasks: this.tasks,
    audits: this.audits,
    enhancements: this.enhancements,
    builds: this.builds,
    uploads: this.uploads,
    tickets: this.tickets,
    workflows: this.workflows,
    reports: this.reports,
    mobileUpdates: this.mobileUpdates,
    pageAudits: this.pageAudits,
    auditEnhancements: this.auditEnhancements,
  }
}

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.methods.serialize = () => {
  return {
    username: this.username || '',
  }
}

userSchema.methods.validatePassword = (password) => {
  return bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hash(password, 10);
}

const User = mongoose.model('user', userSchema);

module.exports = { User }

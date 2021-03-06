'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const statusSchema = mongoose.Schema({
  user: String,
  date: String,
  tasks: Array,
  audits: Array,
  enhancements: Array,
  builds: Array,
  uploads: Number,
  tickets: Number,
  workflows: Number,
  reports: Number,
  mobileUpdates: Number,
  reviews: Number,
  percentage: Array,
});

statusSchema.methods.serialize = function() {
  return {
    id: this._id,
    user: this.user,
    date: this.date,
    tasks: this.tasks,
    audits: this.audits,
    enhancements: this.enhancements,
    builds: this.builds,
    uploads: this.uploads,
    tickets: this.tickets,
    workflows: this.workflows,
    reports: this.reports,
    mobileUpdates: this.mobileUpdates,
    reviews: this.reviews,
    percentage: this.percentage,
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

userSchema.methods.serialize = function() {
  return {
    username: this.username || '',
  }
}

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

const Status = mongoose.model('status', statusSchema);

const User = mongoose.model('user', userSchema);

module.exports = { Status, User }

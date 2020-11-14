'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const statusSchema = mongoose.Schema({

});

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

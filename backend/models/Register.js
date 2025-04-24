const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const RegisterSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  retypePassword: {
    type: String,
    required: true,
  },
});

// Hash both password and retypePassword before saving
RegisterSchema.pre('save', async function (next) {
  try {
    // Hash password if modified
    if (this.isModified('password') && this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    // Hash retypePassword if modified
    if (this.isModified('retypePassword') && this.retypePassword) {
      const salt = await bcrypt.genSalt(10);
      this.retypePassword = await bcrypt.hash(this.retypePassword, salt);
    }

    next();
  } catch (error) {
    console.error('Error in pre-save middleware:', error);
    next(error);
  }
});

// Compare password for login
RegisterSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error('Error comparing password:', error);
    throw error;
  }
};

const Register = mongoose.model('Register', RegisterSchema);

module.exports = Register;
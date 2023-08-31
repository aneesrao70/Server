const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    uname: {
        type: String,
        required: [true, 'Please provide your Name']
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures email addresses are unique
        trim: true,
        lowercase: true,
        validate: {
          validator: function (email) {
            // Regular expression to check email format
            return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]/.test(email);
          },
          message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Set the default value to the current date and time
    },
    agree: {
      type: Boolean,
      required: true,
    },
    verified : {
      type: Boolean,
      default: false,
    }, 
    verificationtoken : {
      type: String,
      required: true,
    }
  })


const registerData = mongoose.model('registerData', registerSchema);

module.exports = registerData;
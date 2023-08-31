const mongoose = require('mongoose');

const resetpassword = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    resetToken: {
        type: String,
        required: true,
    }
})

const resetToken = mongoose.model('resetToken' , resetpassword);

module.exports = resetToken;
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter a valid username"],
        trim: true
    },
    firstname: {
        type: String,
        required: [true, "Please enter your firstname"],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, "Please enter your lastname"],
        trim: true
    },
    password: {
        type: String,
        minlength: [6, "Password must be longer than 6 characters"],
        maxlength: [18, "Password cannot be longer than 18 characters"],
        required: [true, "Please enter a valid password"],
        trim: true
    },
    createdon: {
        type: Date,
        default: Date.now()
    }
})

const User = mongoose.model("User", UserSchema);
module.exports = User;
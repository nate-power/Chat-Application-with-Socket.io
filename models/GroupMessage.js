const mongoose = require('mongoose');

const GroupMessageSchema = new mongoose.Schema({
    from_user: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: [true, "Please select a room"]
    },
    message: {
        type: String,
        required: [true, "Please enter a message"],
        trim: true
    },
    date_sent: {
        type: Date,
        default: Date.now()
    }
})

const GroupMessage = mongoose.model("GroupMessage", GroupMessageSchema);
module.exports = GroupMessage;
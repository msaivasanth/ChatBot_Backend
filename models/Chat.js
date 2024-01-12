const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        user: {
            type: String,
            required: true
        },
        bot: {
            type: String,
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Chat = mongoose.model('chats', chatSchema)
module.exports = Chat
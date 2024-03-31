const mongoose = require("mongoose");

const chatListSchema = new mongoose.Schema({
    senderId: mongoose.SchemaTypes.ObjectId,
    receiverId: mongoose.SchemaTypes.ObjectId,
    chatId: {
        type: String,
        required: true
    },
    unseenCount: {
        type: Number,
        default: 0
    },
    initChat: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true });

module.exports = mongoose.model("chat-list", chatListSchema);
const mongoose = require("mongoose");

const userChatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "document", "video", "audio"]
    },
    message: {
      type: String,
    },
    chatId: {
      type: String,

    },
    sentTime: {
      type: Date,
    },
    deliveredTime: {
      type: Date,
    },
    seenTime: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user-Chat", userChatSchema);
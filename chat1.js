const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
var cors = require("cors");
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
require("dotenv").config();
const userChat = require("./Models/userChatModel");
const chatList = require("./Models/chatList");
const user = require("./Models/user");
// app.use(
//   cors({
//     origin: "*",
//   })
// );
app.use(cors());

// Database connect
mongoose
  .connect(process.env.MONGOURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connected for socket!");
  })
  .catch((error) => {
    console.log("Error connecting to database in socket!");
  });

io.on("connection", (socket) => {
  console.log("A user connected");
  //   const token = socket.handshake.headers.authorization;
  //  console.log(token)
  // if (token) {
  socket.on("login", async ({ senderId, receiverId }) => {
    try {
    //   console.log("Sender ID:", senderId);
    //   console.log("Receiver ID:", receiverId);
      // console.log(`User ${senderName} connected`);
      socket.join(senderId);

      let senderDetails = await user.findOne({ _id: senderId });
      if (!senderDetails) {
        console.log("Sender details doesn't exist!");
      }

      let senderName = senderDetails.fname + " " + senderDetails.lname;
      console.log(`User ${senderName} joined the room!`);

      io.to(senderId).emit(
        "receivedMessage",
        `User ${senderName}, Welcome to the private room!`
      );

      let chatId = v4();
      let chatListData = [
        {
          senderId: senderId,
          receiverId: receiverId,
          chatId,
        },
        {
          senderId: receiverId,
          receiverId: senderId,
          chatId,
        },
      ];
      const existingChatEntry = await chatList.findOne({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      });
      
      if (!existingChatEntry) {
        await chatList.insertMany(chatListData);
      }
     
    
    //    await chatList.insertMany(chatListData)
      socket.on("sendMessage", async ({chatId,messageType, message }) => {
        console.log("Sender ID:", senderId);
        console.log("Receiver ID:", receiverId);
        let chatObj = {
          chatId,
          senderId,
          receiverId,
          messageType,
          message,
        };
        // console.log(chatObj)
        if (messageType === "text") {
          io.to(receiverId).emit(
            "receivedMessage",
            `${JSON.stringify(chatObj)}`
          );
        } else if (messageType === "image") {
          io.to(receiverId).emit(
            "receivedMessage",
            `${JSON.stringify(chatObj)}`
          );
        } else if (messageType === "document") {
          io.to(receiverId).emit(
            "receivedMessage",
            `${JSON.stringify(chatObj)}`
          );
        } else if (messageType === "video") {
          io.to(receiverId).emit(
            "receivedMessage",
            `${JSON.stringify(chatObj)}`
          );
        } else if (messageType === "audio") {
          io.to(receiverId).emit(
            "receivedMessage",
            `${JSON.stringify(chatObj)}`
          );
        }

        let newChatId = chatId;

        let checkChatList = await chatList.findOne({
          senderId: new mongoose.Types.ObjectId(receiverId),
          receiverId: new mongoose.Types.ObjectId(senderId),
        });

        if (!chatId) {
          if (checkChatList) {
            newChatId = checkChatList.chatId;
          } else {
            let chatId = v4();
            let chatListData = [
              {
                senderId: new mongoose.Types.ObjectId(senderId),
                receiverId: new mongoose.Types.ObjectId(receiverId),
                chatId,
              },
              {
                senderId: new mongoose.Types.ObjectId(receiverId),
                receiverId: new mongoose.Types.ObjectId(senderId),
                chatId,
              },
            ];
            await chatList.insertMany(chatListData);
            newChatId = chatId;
          }
        }
        chatObj.chatId = newChatId;
        await chatList.findOneAndUpdate(
          {
            senderId: new mongoose.Types.ObjectId(receiverId),
            receiverId: new mongoose.Types.ObjectId(senderId),
          },
          { $set: { unseenCount: checkChatList.unseenCount + 1 } }
        );
        await chatList.updateMany(
          { chatId: newChatId },
          { $set: { initChat: true } }
        );
        const newChatMessage = await userChat.create(chatObj);

        console.log("Message saved to MongoDB", newChatMessage);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    } catch (error) {
      console.error("Error:", error.message);
      socket.disconnect(true); // Disconnect the client if token verification fails
    }
  });
  // } else {
  //   console.error("No token provided");
  //   socket.disconnect(true); // Disconnect the client if no token is provided
  // }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000 for socket");
});

const { Server } = require("socket.io");
const Message = require("../models/message");

// socket.io instance ko globally use karne ke liye
let io;

// online users ko store karega
// format:
// {
//   userId: socketId
// }
const onlineUsers = {};

// socket initialize
const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  // jab koi client connect hota hai
  io.on("connection", (socket) => {

    console.log("✅ User Connected:", socket.id);

    // user join
    // frontend login ke baad user id bhejta hai
    socket.on("join", async (userId) => {

      // user id ke against socket id store karo
      onlineUsers[userId] = socket.id;

      // user online aaya to uske pending messages delivered kar do
      const result = await Message.updateMany(
        {
          receiver: userId,
          delivered: false,
        },
        {
          delivered: true,
        }
      );

      // agar koi message update hua hai
      if (result.modifiedCount > 0) {

        // delivered messages nikalo jo abhi seen nahi hue
        const pendingMessages = await Message.find({
          receiver: userId,
          delivered: true,
          seen: false,
        });

        // har message ke sender ko notify karo
        pendingMessages.forEach((msg) => {

          // sender online hai ya nahi check karo
          const senderSocketId = onlineUsers[msg.sender.toString()];

          if (senderSocketId) {

            // sender ko delivered event bhejo
            io.to(senderSocketId).emit("messages-delivered", {
              senderId: msg.sender,
              receiverId: userId,
            });

          }

        });

      }

      console.log("Online Users:", onlineUsers);

      // sab clients ko updated online users bhejo
      io.emit("online-users", Object.keys(onlineUsers));

    });

    // typing start
    socket.on("typing", ({ senderId, receiverId }) => {

      // receiver online hai ya nahi
      const receiverSocketId = onlineUsers[receiverId];

      if (receiverSocketId) {

        // sirf receiver ko typing event bhejo
        io.to(receiverSocketId).emit("typing", {
          senderId,
        });

      }

    });

    // typing stop
    socket.on("stop-typing", ({ senderId, receiverId }) => {

      // receiver online hai ya nahi
      const receiverSocketId = onlineUsers[receiverId];

      if (receiverSocketId) {

        // receiver ko stop typing event bhejo
        io.to(receiverSocketId).emit("stop-typing", {
          senderId,
        });

      }

    });

    // message seen
    socket.on("message-seen", async ({ senderId, receiverId }) => {

      try {

        // check karne ke liye console
        console.log("MESSAGE SEEN RECEIVED");
        console.log("senderId:", senderId);
        console.log("receiverId:", receiverId);

        // sender ke saare unseen messages ko seen kar do
        const result = await Message.updateMany(
          {
            sender: senderId,
            receiver: receiverId,
            seen: false,
          },
          {
            seen: true,
            delivered: true,
          }
        );

        // agar database me update hua hai
        if (result.modifiedCount > 0) {

          // sender online hai ya nahi
          const senderSocketId = onlineUsers[senderId];

          if (senderSocketId) {

            // sender ko notify karo ki receiver ne message dekh liya
            io.to(senderSocketId).emit("messages-seen", {
              senderId,
              receiverId,
            });

          }

        }

        console.log("Modified Count:", result.modifiedCount);

      } catch (error) {

        console.log("Message Seen Error:", error.message);

      }

    });

    // user disconnect
    socket.on("disconnect", () => {

      // jis user ka socket disconnect hua usko online list se hata do
      for (const userId in onlineUsers) {

        if (onlineUsers[userId] === socket.id) {

          delete onlineUsers[userId];
          break;

        }

      }

      // sab clients ko updated online users bhejo
      io.emit("online-users", Object.keys(onlineUsers));

      console.log("❌ User Disconnected:", socket.id);
      console.log("Online Users:", onlineUsers);

    });

  });

};

// dusri files me io use karne ke liye
const getIO = () => io;

// dusri files me online users use karne ke liye
const getOnlineUsers = () => onlineUsers;

module.exports = {
  initSocket,
  getIO,
  getOnlineUsers,
};
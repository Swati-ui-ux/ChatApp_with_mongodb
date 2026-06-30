const Message = require("../models/message");
const {getIO,getOnlineUsers} = require("../socket/socket")
// Send Message
const sendMessage = async (req, res) => {
  try {
    const sender = req.user.userId
    const { text,receiver } = req.body;
    const io = getIO();
    const onlineUsers = getOnlineUsers();
    const receiverSocketId = onlineUsers[receiver];
    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "Message text is required",
      });
    }
    if (!receiver) {
      return res.status(400).json({
      message: "Receiver is required",
    });
    }  
    
    const message = await Message.create({
       sender,
      text: text.trim(),
      receiver,
      delivered: !!receiverSocketId,
    });

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("receive-message", message);
  }
  const senderSocketId = onlineUsers[sender];
  if (senderSocketId) {
    io.to(senderSocketId).emit("messages-delivered", {
      senderId: receiver,
      receiverId: sender,
    });
  }
    console.log(message);
    res.status(201).json(message);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Failed to save message",
    });
  }
};

// Get All Messages
const getMessage = async (req, res) => {
  try {
    const receiverId = req.params.receiverId
    const messages = await Message.find({
      $or: [
        {
          sender: req.user.userId,
          receiver:receiverId
        },
        {
          receiver: req.user.userId,
          sender:receiverId
        }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};

module.exports = {
  sendMessage,
  getMessage,
};
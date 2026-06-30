import React, { useEffect, useState, useRef } from "react";

import api from "../../utils/axiosInstence";
import { toast } from "react-toastify";
import socket from "../../utils/socket";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { BsEmojiSmile,BsCheck,BsCheck2All } from "react-icons/bs";
const ChatWindow = ({ selectedUser,onlineUsers }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null)
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isOnline =
    selectedUser &&
    onlineUsers.includes(selectedUser._id);
  const typingTimeoutRef = useRef(null);
  const bottomRef = useRef(null)
  // Fetch old messages
  const fetchMessages = async () => {
    if (!selectedUser) return;

    try {
      const res = await api.get(`/message/${selectedUser._id}`);
      setMessages(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load messages");
    }
  };

  // Load messages when user changes
  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  
    // typing indicator
  useEffect(() => {

    const handleTyping = ({ senderId }) => {

        if (
            selectedUser &&
            senderId === selectedUser._id
        ) {
            setIsTyping(true);
        }

    };

    const handleStopTyping = ({ senderId }) => {

        if (
            selectedUser &&
            senderId === selectedUser._id
        ) {
            setIsTyping(false);
        }

    };

    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
        socket.off("typing", handleTyping);
        socket.off("stop-typing", handleStopTyping);
    };

}, [selectedUser]);

  // Listen for realtime messages
 useEffect(() => {

  const handleReceiveMessage = (message) => {

    if (
      selectedUser &&
      (
        String(message.sender) === String(selectedUser._id) ||
        String(message.receiver) === String(selectedUser._id)
      )
    ) {

      setMessages((prev) => [...prev, message]);

  

    }

  };

  // ===============================
  // THIS SHOULD BE HERE
  // ===============================
  socket.on("receive-message", handleReceiveMessage);

  return () => {
    socket.off("receive-message", handleReceiveMessage);
  };

}, [selectedUser]);
  // for autoscroll
  useEffect(()=> {
    bottomRef.current?.scrollIntoView({
    behavior:'smooth'
    })
  },[messages])
  
// send seen event when chat opens
useEffect(() => {
  if (!selectedUser) return;
  socket.emit("message-seen", { senderId: selectedUser._id, receiverId: currentUser._id });
}, [selectedUser]);

// delivered listener
useEffect(() => {
  const handleMessagesDelivered = ({ senderId }) => {
    if (senderId !== selectedUser?._id) return;

    setMessages(prev =>
      prev.map(msg =>
        String(msg.receiver) === String(selectedUser._id) && !msg.delivered
          ? { ...msg, delivered: true }
          : msg
      )
    );
  };

  socket.on("messages-delivered", handleMessagesDelivered);
  return () => socket.off("messages-delivered", handleMessagesDelivered);
}, [selectedUser]);

// seen listener
useEffect(() => {
  const handleMessagesSeen = ({ senderId }) => {
    console.log("messages-seen event", senderId);

    setMessages(prev =>
      prev.map(msg =>
        String(msg.sender) === String(currentUser._id) &&
        String(msg.receiver) === String(selectedUser._id)
          ? { ...msg, delivered: true, seen: true }
          : msg
      )
    );
  };

  socket.on("messages-seen", handleMessagesSeen);
  return () => socket.off("messages-seen", handleMessagesSeen);
}, [selectedUser]);

// send seen when last message is received
useEffect(() => {
  if (!selectedUser || !messages.length) return;

  const lastMessage = messages[messages.length - 1];

  if (
    String(lastMessage.sender) === String(selectedUser._id) &&
    String(lastMessage.receiver) === String(currentUser._id) &&
    !lastMessage.seen
  ) {
    socket.emit("message-seen", { senderId: selectedUser._id, receiverId: currentUser._id });
  }
}, [messages, selectedUser]);

// close emoji picker on outside click
useEffect(() => {
  const handleClickOutside = (e) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target))
      setShowEmojiPicker(false);
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

// close emoji picker on esc
useEffect(() => {
  const handleEsc = (e) => e.key === "Escape" && setShowEmojiPicker(false);

  document.addEventListener("keydown", handleEsc);
  return () => document.removeEventListener("keydown", handleEsc);
}, []);

// send message
const handleSend = async () => {
  if (!text.trim() || !selectedUser) return;

  try {
    const res = await api.post("/message/msg", { receiver: selectedUser._id, text });
    setMessages(prev => [...prev, res.data]);
    console.log("Message Status :", res.data);
    setText("");
  } catch (error) {
    console.log(error);
    toast.error("Failed to send message");
  }
};

// no user selected
if (!selectedUser) {
  return (
    <div className="flex flex-1 items-center justify-center text-xl text-gray-500">
      Select a user to start chatting
    </div>
  );
}

// handle input change
const handleChange = (e) => {
  setText(e.target.value);

  socket.emit("typing", { senderId: currentUser._id, receiverId: selectedUser._id });

  clearTimeout(typingTimeoutRef.current);

  typingTimeoutRef.current = setTimeout(() => {
    socket.emit("stop-typing", { senderId: currentUser._id, receiverId: selectedUser._id });
  }, 1000);
};

// add emoji
const handleEmojiClick = (emojiData) => setText(prev => prev + emojiData.emoji);

// format message time
const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  
  
return (
  <div className="flex flex-col flex-1 h-full">
 {/* Header */}
    <div className="bg-white border-b shadow-sm p-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
          <p className={`text-sm ${isOnline ? "text-green-600" : "text-gray-500"}`}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      {isTyping && (
        <p className="text-sm italic text-green-500">Typing...</p>
      )}
    </div>
   {/* Messages */}
    <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
      {messages.length ? (
        messages.map((msg) => {
          const isMe = String(msg.sender) === String(currentUser._id);

          return (
            <div key={msg._id} className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${isMe ? "rounded-br-md bg-blue-400 text-white" : "rounded-bl-md bg-white text-black"}`}>
                <p className="wrap-break-word">{msg.text}</p>

                <div className="mt-1 flex items-center justify-end gap-1 text-[10px]">
                  <span className={isMe ? "text-blue-200" : "text-gray-500"}>{formatTime(msg.createdAt)}</span>

                  {isMe &&
                    (!msg.delivered ? (
                      <BsCheck className="text-sm text-gray-200" />
                    ) : (
                      <BsCheck2All className={`text-sm ${msg.seen ? "text-green-600" : "text-gray-300"}`} />
                    ))}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex h-full items-center justify-center text-gray-500">
          No messages yet
        </div>
      )}

      <div ref={bottomRef} />
    </div>

   {/* Input */}
<div className="flex gap-3 border-t bg-white p-4">

  <div className="relative">
    <button onClick={() => setShowEmojiPicker(prev => !prev)} className="text-2xl">
      <BsEmojiSmile />
    </button>

    {showEmojiPicker && (
      <div ref={pickerRef} className="absolute bottom-12 left-0 z-50">
        <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.LIGHT} />
      </div>
    )}
  </div>

  <input
    type="text"
    placeholder="Type a message..."
    value={text}
    onChange={handleChange}
    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
    className="flex-1 rounded-full border px-5 py-3 outline-none focus:border-blue-500"
  />

  <button
    onClick={handleSend}
    className="rounded-full bg-blue-600 px-6 text-white transition hover:bg-blue-700"
  >
    Send
  </button>

</div>

  </div>
);
};

export default ChatWindow;
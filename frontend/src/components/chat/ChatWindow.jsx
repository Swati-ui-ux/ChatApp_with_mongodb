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
  <div className="flex h-full flex-1 flex-col bg-slate-100 transition-colors duration-300 dark:bg-slate-950">

    {/* Header */}
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
          {selectedUser.name}
        </h2>

        <div className="mt-1 flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-slate-400"}`} />

          <p className={`text-sm font-medium ${
            isOnline
              ? "text-emerald-500"
              : "text-slate-500 dark:text-slate-400"
          }`}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 user-scroll overflow-y-auto bg-slate-100 p-5 transition-colors duration-300 dark:bg-slate-950">

      {messages.length ? (
        messages.map((msg) => {
          const isMe = String(msg.sender) === String(currentUser._id);

          return (
            <div
              key={msg._id}
              className={`mb-4 flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={
                  isMe
                    ? "max-w-[70%] rounded-2xl rounded-br-md bg-linear-to-r from-blue-600 to-blue-500 px-4 py-3 text-white shadow-md"
                    : "max-w-[70%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                }
              >
                <p className="wrap-break-word text-[15px] leading-relaxed">
                  {msg.text}
                </p>

                <div className="mt-2 flex items-center justify-end gap-1 text-[11px]">
                  <span className={isMe ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}>
                    {formatTime(msg.createdAt)}
                  </span>

                  {isMe &&
                    (!msg.delivered ? (
                      <BsCheck className="text-sm text-slate-300" />
                    ) : (
                      <BsCheck2All
                        className={`text-sm transition-colors ${
                          msg.seen ? "text-emerald-400" : "text-slate-300"
                        }`}
                      />
                    ))}
                </div>
              </div>
            </div>
          );
                  
        })
      ) : (
        <div className="flex h-full items-center justify-center text-lg font-medium text-slate-500 dark:text-slate-400">
          No messages yet
        </div>
      )}
      {isTyping && (
        <p className="text-sm italic text-blue-500 dark:text-white">
          Typing...
        </p>
      )}
      <div ref={bottomRef} />
    </div>

    {/* Input */}
    <div className="flex items-center gap-3 border-t border-slate-200 bg-white p-4 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">

      <div className="relative">
        <button
          onClick={() => setShowEmojiPicker(prev => !prev)}
          className="rounded-full p-2 text-2xl text-slate-500 transition hover:bg-slate-100 hover:text-blue-500 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <BsEmojiSmile />
        </button>

        {showEmojiPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-12 left-0 z-50"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={Theme.LIGHT}
            />
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={handleChange}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          !e.shiftKey &&
          (e.preventDefault(), handleSend())
        }
        className="flex-1 rounded-full border border-slate-300 bg-slate-50 px-5 py-3 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-700"
      />

      <button
        onClick={handleSend}
        className="rounded-full bg-linear-to-r from-blue-600 to-blue-500 px-6 py-3 font-medium text-white shadow-md transition-all hover:scale-105 hover:from-blue-700 hover:to-blue-600 active:scale-95"
      >
        Send
      </button>

    </div>

  </div>
);
};

export default ChatWindow;
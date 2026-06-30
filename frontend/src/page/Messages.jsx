import UserList from "../components/chat/UserList";
import ChatWindow from "../components/chat/ChatWindow";
import { useState,useEffect } from "react";
import socket from "../utils/socket";
const Messages = () => {

    const [selectedUser, setSelectedUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    useEffect(() => {
    socket.on("online-users", (users) => {
        setOnlineUsers(users);
    });
    return () => {
        socket.off("online-users");
    };
    }, []);
    
    return (
        <div className="flex h-screen">

            <UserList
                onlineUsers={onlineUsers}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
            />

            <ChatWindow
                selectedUser={selectedUser}
                 onlineUsers={onlineUsers}
            />

        </div>
    );
};

export default Messages;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import Messages from "../page/Messages";
import { FaMoon, FaSun } from "react-icons/fa"

const Home = () => {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
  if (!user) return;

  socket.connect();

  const handleConnect = () => {
    console.log("Socket Connected:", socket.id);

    socket.emit("join", user._id);

    console.log("Join emitted:", user._id);
  };

  socket.on("connect", handleConnect);

  return () => {
    socket.off("connect", handleConnect);
    socket.disconnect();
  };
}, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    socket.disconnect();

    navigate("/login");
  };

  return (
    <div className="h-screen">

      <div className="flex justify-between p-4 border-b">

        <h1 className="text-2xl font-bold">
          Chat App
          👤{user?.name}
        </h1>
        {/* <h1>👤{user.name}</h1> */}
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      <Messages />

    </div>
  );
};

export default Home;
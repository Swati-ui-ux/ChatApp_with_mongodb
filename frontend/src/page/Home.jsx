import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import Messages from "../page/Messages";
import { FaMoon, FaSun } from "react-icons/fa"
import { useTheme } from "../context/ThemeContext"

const Home = () => {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { darkMode, toggleTheme } = useTheme();

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
 <div className="min-h-screen bg-slate-100 text-slate-900 transition-all duration-300 dark:bg-slate-950 dark:text-slate-100">

<header className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">

<div className="flex items-center gap-4">
  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 bg-slate-200 dark:bg-slate-700">
    {user?.profilePic ? (
      <img
        src={user.profilePic}
        alt={user.name}
        className="h-full w-full object-cover"
      />
    ) : (
      <span className="text-lg font-bold text-slate-700 dark:text-white">
        {user?.name?.charAt(0).toUpperCase()}
      </span>
    )}
  </div>

  <div>
    <h1 className="text-2xl font-bold">💬 Chat App</h1>

    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
      Welcome, {user?.name}
    </p>
  </div>
</div>

<div className="flex gap-3">

<button
onClick={toggleTheme}
className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white shadow transition-all hover:scale-105 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
>
{darkMode ? <FaSun /> : <FaMoon />}
</button>

<button
onClick={handleLogout}
className="rounded-xl bg-red-500 px-5 py-2 font-medium text-white transition-all hover:scale-105 hover:bg-red-600"
>
Logout
</button>

</div>

</header>

<Messages />

</div>
);
};

export default Home;
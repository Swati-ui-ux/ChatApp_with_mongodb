import { useEffect, useState } from "react";
import api from "../../utils/axiosInstence";
import { FaSearch } from "react-icons/fa";

const UserList = ({ selectedUser, setSelectedUser, onlineUsers }) => {
const [users, setUsers] = useState([]);
const [search, setSearch] = useState("");
const currentUser = JSON.parse(localStorage.getItem("user"));

useEffect(() => { fetchUsers(); }, []);

const fetchUsers = async () => {
    try {
        const res = await api.get("/users/all");
        const { users } = res.data;
        setUsers(users.filter(user => user._id !== currentUser._id));
    } catch (err) {
        console.log(err)
    }
};

const filteredUsers = users.filter(user =>
user.name.toLowerCase().includes(search.toLowerCase()) ||
user.email.toLowerCase().includes(search.toLowerCase())
);

return (
<div className=" user-scroll w-1/4 overflow-y-auto border-r border-slate-200 bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
   <h2 className="p-5 text-2xl font-bold text-slate-800 dark:text-white">Users</h2>

   <div className="mx-4 mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 shadow-sm transition-all focus-within:border-blue-500 focus-within:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus-within:bg-slate-700">
    <FaSearch className="text-slate-500 dark:text-slate-400" />
   <input
  type="text"
  placeholder="Search users..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="flex-1 bg-transparent text-slate-800 placeholder:text-slate-400 outline-none dark:text-white dark:placeholder:text-slate-500"
/>
    </div>

    {filteredUsers.length === 0 ? (
   <p className="mt-10 text-center text-slate-500 dark:text-slate-400">
  No users found
            </p>
            
    ) : (
    filteredUsers.map(user => {
    const isOnline = onlineUsers.includes(user._id);

    return (
        <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={` mx-2 mb-2 cursor-pointer rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md dark:hover:border-slate-700 dark:hover:bg-slate-800 ${
                selectedUser?._id === user._id
                ? "border-blue-200 bg-blue-100 shadow-sm dark:border-blue-500 dark:bg-slate-800"
                : ""
            }`}
            >
        <div className="flex items-center gap-3">
  <div className="h-12 w-12 overflow-hidden rounded-full border border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700 flex items-center justify-center">
    {user.profilePic ? (
      <img
        src={user.profilePic}
        alt={user.name}
        className="h-full w-full object-cover"
      />
    ) : (
      <span className="text-lg font-semibold text-slate-700 dark:text-white">
        {user.name.charAt(0).toUpperCase()}
      </span>
    )}
  </div>

  <div className="flex-1">
    <h3 className="text-[15px] font-semibold text-slate-800 dark:text-white">
      {user.name}
    </h3>

    <p className="text-sm text-slate-500 dark:text-slate-400">
      {user.email}
    </p>

    <p
      className={`mt-1 flex items-center gap-2 text-xs font-medium ${
        isOnline
          ? "text-emerald-500"
          : "text-slate-400 dark:text-slate-500"
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          isOnline ? "bg-emerald-500" : "bg-slate-400"
        }`}
      ></span>

      {isOnline ? "Online" : "Offline"}
    </p>
  </div>
</div>
        </div>
        );
    })
        )}
        
</div>
);
};

export default UserList;
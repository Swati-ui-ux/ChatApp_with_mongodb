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
<div className="w-1/4 border-r overflow-y-auto">
    <h2 className="p-4 text-xl font-bold">Users</h2>

    <div className="mx-3 mb-3 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
    <FaSearch className="text-gray-500" />
    <input
    type="text"
    placeholder="Search users..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 outline-none"
    />
    </div>

    {filteredUsers.length === 0 ? (
    <p className="mt-5 text-center text-gray-500">No users found</p>
    ) : (
    filteredUsers.map(user => {
    const isOnline = onlineUsers.includes(user._id);

    return (
        <div
        key={user._id}
        onClick={() => setSelectedUser(user)}
        className={`cursor-pointer border-b p-4 hover:bg-gray-100 ${selectedUser?._id === user._id ? "bg-blue-100" : ""}`}
        >
        <h3 className="font-semibold">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-sm">{isOnline ? "🟢 Online" : "⚫ Offline"}</p>
        </div>
        );
    })
        )}
        
</div>
);
};

export default UserList;
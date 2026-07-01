require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db_connection");

const http = require("http");

const { initSocket } = require("./socket/socket");

const app = express();

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json());

const startServer = async () => {
  const connected = await connectDB();

  if (!connected) {
    process.exit(1);
  }

  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

startServer();

// Routes
const userRoute = require("./routes/user");
const messageRoute = require("./routes/message");

app.use("/users", userRoute);
app.use("/message", messageRoute);

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
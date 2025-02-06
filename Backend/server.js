const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const socketIo = require("socket.io");
const post = require("./routes/post");
const authRoutes = require("./routes/auth");
const ChatRoute = require("./routes/chat");
const MessageRoute = require("./routes/message");

const app = express();

app.use(express.json());
app.use(cors());

const mongo_url = config.get("mongo_url");
mongoose.set("strictQuery", true);
mongoose
  .connect(mongo_url)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/post", post);
app.use("/api/auth", authRoutes);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Origine de votre frontend
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("new-user-add", (newUserId) => {
    console.log(`New user added: ${newUserId}`);
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("Active users:", activeUsers);
    }
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("Active users after disconnect:", activeUsers);
    io.emit("get-users", activeUsers);
  });

  socket.on("send-message", (data) => {
    console.log("Sending message:", data);
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      console.log(`Sending message to user ${receiverId}`);
      io.to(user.socketId).emit("receive-message", data);
    } else {
      console.log("User not found for message:", receiverId);
    }
  });
});

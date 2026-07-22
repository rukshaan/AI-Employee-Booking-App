const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./app/models");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Pass io to request so controllers can use it if needed
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Employee Booking System" });
});

require("./app/routes/route.js")(app);

db.sequelize.sync({ alter: true }).then(async () => {
  console.log("PostgreSQL connected successfully");

  const Admin = db.Admin;
  const existing = await Admin.findOne({ where: { email: "admin@gmail.com" } });
  if (!existing) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await Admin.create({ email: "admin@gmail.com", password: hashedPassword });
    console.log("Default admin seeded");
  }
}).catch(err => {
  console.error("Cannot connect to PostgreSQL", err);
});

const PORT = process.env.PORT || 8080;

// Socket.io connection logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (bookingId) => {
    socket.join(`room_${bookingId}`);
    console.log(`User joined room_${bookingId}`);
  });

  socket.on("send_message", async (data) => {
    // data should contain { senderId, senderType, receiverId, text, bookingId }
    try {
      const Message = db.Message;
      const newMsg = await Message.create({
        senderId: data.senderId,
        senderType: data.senderType,
        receiverId: data.receiverId,
        text: data.text,
        bookingId: data.bookingId
      });
      // emit to room
      io.to(`room_${data.bookingId}`).emit("receive_message", newMsg);
    } catch (err) {
      console.error("Error saving message", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", error => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Close the old process and try again.`);
  } else {
    console.error(error);
  }
  process.exit(1);
});
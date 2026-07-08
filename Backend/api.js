const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./app/models");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

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
const server = app.listen(PORT, () => {
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
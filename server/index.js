import os from "os";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

const port = 4000;
const app = express();
const server = createServer(app);
// const io = new Server(server);
const io = new Server({
  cors: {
    origin: "http://localhost:4000"
  }
})
const networkInterfaces = os.networkInterfaces();

const defaultResponse = {
  heartbeat_count: 0,
  is_operational: 0,
};

let commands = defaultResponse;
let commandsStatus = defaultResponse;

let gpsStatus = defaultResponse;
let armStatus = defaultResponse;
let driveStatus = defaultResponse;
let scienceStatus = defaultResponse;
let autonomyStatus = defaultResponse;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve the HTML file

var __dirname = ""
  // "C:/Users/ninawang/Documents/Robotics/urc-teleoperation-2024/server";
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join("public", "index.html"));
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("post commands", (data) => {
    commands = data;
    console.log("POST /commands", commands);
    io.emit("commands status", commandsStatus);
  });

  socket.on("get commands", () => {
    socket.emit("commands", commands);
  });

  socket.on("post drive", (data) => {
    commands.drive = data;
    console.log("POST /drive", commands.drive);
    io.emit("drive status", driveStatus);
  });

  socket.on("get drive", () => {
    socket.emit("drive", commands.drive);
  });

  socket.on("get arm", () => {
    socket.emit("arm", commands.arm);
  });

  socket.on("post arm", (data) => {
    commands.arm = data;
    console.log("POST /arm", commands.arm);
    io.emit("arm status", armStatus);
  });

  socket.on("get gps", () => {
    socket.emit("gps", commands.gps);
  });

  socket.on("post gps", (data) => {
    commands.gps = data;
    console.log("POST /gps", commands.gps);
    io.emit("gps status", gpsStatus);
  });

  socket.on("get science", () => {
    socket.emit("science", commands.science);
  });

  socket.on("post science", (data) => {
    commands.science = data;
    console.log("POST /science", commands.science);
    io.emit("science status", scienceStatus);
  });

  socket.on("get autonomy", () => {
    socket.emit("autonomy", commands.autonomy);
  });

  socket.on("post autonomy", (data) => {
    commands.autonomy = data;
    console.log("POST /autonomy", commands.autonomy);
    io.emit("autonomy status", autonomyStatus);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
  for (const key in networkInterfaces) {
    const networkInterface = networkInterfaces[key];
    for (const network of networkInterface) {
      if (network.family === "IPv4" && !network.internal) {
        console.log(`Network: http://${network.address}:${port}`);
      }
    }
  }
});

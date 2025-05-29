import os from "os";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
// import { SerialPort } from "serialport";
import { autoDetect } from '@serialport/bindings-cpp';
import path from "path";
import { SerialPort } from "serialport";

const port = 4000;
const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);
const io = new Server(server);

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

// Testing purposes
// Serve the HTML file
var __dirname = ""
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join("public", "index.html"));
});

// SERIAL SETUP
const binding = autoDetect();
const devices = await binding.list();
let serialPort = null;

for (const device of devices) {
  try {
    console.log(`Attempting to open device: ${device.path}`);
    const options = {
      path: device.path,
      baudRate: 115200,
    };
    if (options.path.includes("usbserial")) {
      serialPort = await binding.open(options);
      console.log(`serial port connected!: ${device.path}`);
      break;
    }
  } catch (error) {
    console.error(`failed to open device at ${device.path}`, error.message);
  }
}

async function writeAndReadData(writeBuffer) {
  // console.log("inside write and read");
  // if returns a carriage return
  // if returns '\x07'
  const decoder = new TextDecoder("utf-8");


  serialPort.write(writeBuffer);

  let readData = Buffer.alloc(6);
  await serialPort.read(readData, 0, 6);
  console.log("Undecoded data: ", readData);
  let decodedData = decoder.decode(readData);
  console.log("Decoded data: ", decodedData);
  if (decodedData.includes('\r')) {
    console.log("Serial CAN responded with CR, continuing\n");
    return true;
  } else if (decodedData.includes('\x07')) {
    console.log("Serial CAN responded with an error!!");
    return false;
  } else {
    console.log("idk");
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

io.on("connection", async (socket) => {
  console.log(`User connected: ${socket.id}`);

  const encoder = new TextEncoder("utf-8");
  const decoder = new TextDecoder("utf-8");
  
  if (serialPort.isOpen) {
    // 2 - 3 CR
    console.log("sending 3 carriage returns");
    const carriageReturnBuffer = Buffer.from('\r\r\r');
    writeAndReadData(carriageReturnBuffer);
    await sleep(200);

    // 3 carriage back is split up for some reason
    writeAndReadData(Buffer.from(''));
    await sleep(200);

    console.log("sending version command");
    writeAndReadData(Buffer.from('V\r'));
    await sleep(200);

    console.log("sending CAN bitrate");
    writeAndReadData(Buffer.from('S8\r'));
    await sleep(200);

    console.log("opening CAN port");
    writeAndReadData(Buffer.from('O\r'));
    await sleep(200);

    console.log("CAN port is now open!");
    // console.log("sending 3 carriage returns");
    // const carriageReturnBuffer = Buffer.from('\r\r\r');
    // serialPort.write(carriageReturnBuffer);

    // let readData = Buffer.alloc(6)
    // await serialPort.read(readData, 0, 6)
    // let decodedData = null;
    // if (readData) {
    //     decodedData = decoder.decode(readData);
    //     console.log("Decoded Data: ", decodedData);
    //   }
    // if (decodedData.includes('\x07')) {
    //   console.log("Serial CAN responded with an error!!!");
    //   console.log("Error clearing serial buffer");
    //   return;
    // }
    // console.log(readData);
    

    // let i = 0;
    // while(true) {
    //   // console.log(i.toString());
    //   serialPort.write(Buffer.from(i.toString()));
    //   if (i > 9) {
    //     i = 0;
    //   }
    //   i++;

    //   // echo it back
    //   let buffer = Buffer.alloc(4)
    //   await serialPort.read(buffer, 0, 4)
    //   const readData = buffer.toString()
    //   console.log(buffer)
    // }
  }

  socket.on("post commands", (data) => {
    commands = data;
    console.log("POST /commands", commands);
    data.forEach(async (command) => {
      console.log("CAN posting command");
      writeAndReadData(Buffer.from(command));
      await sleep(200);
    })
    io.emit("commands status", commandsStatus);


    // let encoder = new TextEncoder();
    // data.forEach((command) => {
    //   console.log("CAN posting command");
    //   serialPort.write(encoder.encode(command));
    //   readData = decoder.decode(serialPort.read());
    //   if (readData.includes('\x07')) {
    //     console.log("error writing command into CAN");
    //   }
    //   console.log(readData);
    // })
    // io.emit("commands status", commandsStatus);
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

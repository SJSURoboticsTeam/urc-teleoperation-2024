import os from "os";
import cors from 'cors'
import express from "express";

const port = 4000;
const app = express();
const networkInterfaces = os.networkInterfaces();

const defaultResponse = {
    "heartbeat_count": 0,
    "is_operational": 0
};

let gpsCommands = defaultResponse;
let armCommands = defaultResponse;
let driveCommands = defaultResponse;
let scienceCommands = defaultResponse;
let autonomyCommands = defaultResponse;

let gpsStatus = defaultResponse;
let armStatus = defaultResponse;
let driveStatus = defaultResponse;
let scienceStatus = defaultResponse;
let autonomyStatus = defaultResponse;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Mission Control Web Server - Built using ExpressJS");
});

app.get("/drive", (req, res) => {
    driveStatus = (req.query);
    console.log("GET /drive");
    res.send(driveCommands);
});

app.post("/drive", (req, res) => {
    driveCommands = (req.body);
    console.log("POST /drive", driveCommands);
    res.send(driveStatus);
});

app.get("/drive/status", (req, res) => {
    console.log("GET drive/status");
    res.json(driveStatus);
});

app.get("/arm", (req, res) => {
    armStatus = (req.query);
    console.log("GET /arm");
    res.send(armCommands);
});

app.post("/arm", (req, res) => {
    armCommands = (req.body);
    console.log("POST /arm", armCommands);
    res.send(armStatus);
});

app.get("/arm/status", (req, res) => {
    console.log("GET arm/status");
    res.json(armStatus);
});

app.get("/gps", (req, res) => {
    console.log("GET /gps");
    gpsStatus = req.query;
    res.send(gpsCommands);
});

app.post("/gps", (req, res) => {
    gpsCommands = req.body;
    console.log("POST /gps");
    res.send(gpsStatus);
});

app.get("/gps/status", (req, res) => {
    console.log("GET /gps/status");
    res.send(gpsStatus);
})

app.get("/science", (req, res) => {
    console.log("GET /science");
    scienceStatus = req.query;
    res.send(scienceCommands);
})

app.post("/science", (req, res) => {
    scienceCommands = (req.body);
    console.log("POST /science");
    res.send(autonomyStatus);
})

app.get("/science/status", (req, res) => {
    console.log("GET /science/status");
    res.send(scienceStatus);
})

app.get("/autonomy", (req, res) => {
    console.log("GET /autonomy");
    autonomyStatus = req.query;
    res.send(autonomyCommands);
})

app.post("/autonomy", (req, res) => {
    autonomyCommands = (req.body);
    console.log("POST /autonomy");
    res.send(autonomyStatus);
})

app.get("/autonomy/status", (req, res) => {
    console.log("GET /autonomy/status");
    res.send(autonomyStatus);
})


app.listen(port, () => {
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
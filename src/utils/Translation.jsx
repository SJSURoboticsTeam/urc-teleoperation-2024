// arm default context set in App.jsx 
// arm:{"speed":0,"rotunda":0,"elbow":0,"shoulder":0,"wristPitch":0,"wristRoll":0,"endEffector":0}

// t, id, length
const armMap = {
    "base": "t1124",
    "shoulder": "t1134",
    "elbow": "t1144",
    "roll": "t1154",
    "pitch": "t1164",
    "yaw": "t1174",
    "endEff": "t1184"
}

// Converts user input stored in arm commands context into CAN frames
function armToCan(arm) {
    const armMessages = [];
    for (let key in arm) {
        let payload = armMap[key];
        payload += arm[key].toString(16).padStart(4, "0");
        payload += "\r";
        armMessages.push(payload);
    }
    return armMessages;
}

function homeArm() {
    return "t1110\r";
}

function keyBoardType() {
    return "t1200\r";
}

// t, id, length
const driveMap = {
    "spin": "t1010",
    "drive": "t1020",
    "translate": "t1030",
    "speedAngle": "t1048", // id: 104 len: 8
};

// Converts user input stored in drive commands context into CAN frames
function driveToCan(drive) {
    // if steer mode transmit 
    const driveMessages = [];

    // MODE MESSAGE
    let mode = "";
    if (driveMap[drive.mode]) { // should be spin, drive, translate
        mode += driveMap[drive.mode];
        mode += "\r";
        console.log(mode);
    } else {
        console.log("uh oh mode wrong");
    }
    driveMessages.push(mode);

    // SPEED AND ANGLE MESSAGE
    // id:104 len: 8 0-3: signed 32 bit speed 4-7: signed 32 bit angle -360 to 360
    let speedAngle = driveMap["speedAngle"];
    speedAngle += drive.speed.toString(16).padStart(4, "0");
    speedAngle += drive.angle.toString(16).padStart(4, "0");
    speedAngle += "\r";
    driveMessages.push(speedAngle);

    return driveMessages;
}

function homeDrive() {
    return "t1060\r"
}

function spinModeOffset(x, y) {
    let payload = "t1058";
    payload += x.toString(16).padStart(4, "0");
    payload += y.toString(16).padStart(4, "0");
    payload += "\r";
    return payload;
}

// science
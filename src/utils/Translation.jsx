
/* arm formatting
    base
    shoulder
    elbow
    roll
    pitch
    yaw
*/

// arm default context set in App.jsx 
// arm:{"speed":0,"rotunda":0,"elbow":0,"shoulder":0,"wristPitch":0,"wristRoll":0,"endEffector":0}
const armMap = {
    "base": "t1124",
    "shoulder": "t1134",
    "elbow": "t1144",
    "roll": "t1154",
    "pitch": "t1164",
    "yaw": "t1174"
}

function armToCan(arm) {
    const armMessages = [];
    for (let key in arm) {
        let payload = armMap[key];
        payload += arm[key].toString(16).padStart(4, "0");
        armMessages.push(payload);
    }
    return armMessages;
}

function homeArm() {

}

function keyBoardType() {

}

const driveMap = {
    // Identifiers already determined in hex
    "spin": "t101",
    "drive": "t102",
    "translate": "t103",
    "speedAngle": "t1048", // id: 104 len: 8
    "spinOffset": "t1058", 
    // do I include drive home in here?
};

/* drive formatting
    string mode
    float? speed
    float? angle
*/
// Converts user input stored in drive commands context into CAN frames
function driveToCan(drive) {
    // if steer mode transmit 
    const driveMessages = [];

    // MODE MESSAGE
    // let mode = "t" // t stands for standard 11 bit CAN frame
    let mode = ""
    if (driveMap[drive.mode]) {
        mode += driveMap[drive.mode];
        console.log(mode);
    } else {
        console.log("uh oh mode wrong");
    }
    driveMessages.push(mode.padStart(3, "0"))

    // SPEED AND ANGLE MESSAGE
    // id:104 len: 8 0-3: signed 32 bit speed 4-7: signed 32 bit angle -360 to 360
    let speedAngle = driveMap["speedAngle"];
    speedAngle += drive.speed.toString(16).padStart(4, "0");
    speedAngle += drive.angle.toString(16).padStart(4, "0");
    driveMessages.push(speedAngle)

    // SPIN MODE OFFSET
    let spinOffset = driveMap["spinOffset"];

    return driveMessages
}

function homeDrive() {

}

function spinModeOffset() {

}

// science
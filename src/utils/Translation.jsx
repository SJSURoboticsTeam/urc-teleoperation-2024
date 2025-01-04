// arm
// JSON to CAN binary
// read in JSON from frontend
// { name: 'speed', label: 'Speed', min: 0, max: 5 },
// { name: 'rotunda', label: 'Rotunda', min: -180, max: 180 },
// { name: 'elbow', label: 'Elbow', min: -75, max: 90 },
// { name: 'shoulder', label: 'Shoulder', min: -45, max: 90 },
// { name: 'wristPitch', label: 'Wrist Pitch', min: -90, max: 90 },
// { name: 'wristRoll', label: 'Wrist Roll', min: -180, max: 180 },
// { name: 'endEffector', label: 'End Effector', min: 0, max: 90 }

// t standard can message command
// iii hexadecimal message id
// l length of message
// dd 2 chars per each hex value in the payload
let payload = "t";

/* arm formatting
    speed: 0,
    rotunda: 90,
    elbow: 0,
    shoulder: 0,
    wristPitch: 0,
    wristRoll: 0,
    endEffector: 0
*/

function armToCan(arm) {
    
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

// science
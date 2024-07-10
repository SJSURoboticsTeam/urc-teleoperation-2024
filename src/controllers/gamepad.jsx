const MIN_ARM_SPEED = 1;
const MAX_ARM_SPEED = 5;

const MIN_ROTUNDA_ANGLE = -90;
const MAX_ROTUNDA_ANGLE = 90;

const MIN_SHOULDER_ANGLE = 0;
const MAX_SHOULDER_ANGLE = 90;

const MIN_ELBOW_ANGLE = -180;
const MAX_ELBOW_ANGLE = 180;

const MIN_WRIST_PITCH_ANGLE = -90;
const MAX_WRIST_PITCH_ANGLE = 90;

const MIN_WRIST_ROLL_ANGLE = -360;
const MAX_WRIST_ROLL_ANGLE = 360;

const MIN_END_EFFECTOR_ANGLE = 0;
const MAX_END_EFFECTOR_ANGLE = 150;

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

let armMapping = {
    joystickVertical: 1,
    thumbJoystickVertical: 9,
    thumbUp: -1,
    thumbDown: 0.14285719394683838,
    joystickRotate: 5,
    joystickTrigger: 0,
    rudder: 6,
    button3: 2,
    button4: 3,
    button5: 4,
    button6: 5,
}

export default class ArmGamepad {
    constructor(gamepad) {
        this.gamepad = gamepad;
    }

    getRotundaAngle(rotunda) { 
        let joystickTriggerInput = this.gamepad.buttons[armMapping.joystickTrigger].value
        if (joystickTriggerInput == 1) {
            let input = this.gamepad.axes[armMapping.joystickRotate];

            input = Math.round(input * 0.55);
            input += rotunda;
            
            input = clamp(input, MIN_ROTUNDA_ANGLE, MAX_ROTUNDA_ANGLE);
            return input;
        } else return rotunda;        
    }

    getShoulderAngle(shoulder) {
        let input = this.gamepad.axes[armMapping.joystickVertical];

        input = Math.round(input * 0.55);
        input = shoulder - input;

        input = clamp(input, MIN_SHOULDER_ANGLE, MAX_SHOULDER_ANGLE);
        return input;
    }

    getElbowAngle(elbow) {
        let input = this.gamepad.axes[armMapping.thumbJoystickVertical];

        if (input == armMapping.thumbUp)
            input = 1;
        else if (input == armMapping.thumbDown)
            input = -1;
        else
            input = 0;
        input += elbow;
        input = clamp(input, MIN_ELBOW_ANGLE, MAX_ELBOW_ANGLE);
        return input;
    }

    getWristPitchAngle(wristPitch) {
        let input = this.gamepad.axes[armMapping.rudder];
        return input * MAX_WRIST_PITCH_ANGLE;
    }

    getWristRollAngle(wristRoll) {
        let button6 = this.gamepad.buttons[armMapping.button6].value;
        let button5 = this.gamepad.buttons[armMapping.button5].value;
        let input = button6 - button5;

        input = Math.round(input);
        input += wristRoll;
        input = clamp(input, MIN_WRIST_ROLL_ANGLE, MAX_WRIST_ROLL_ANGLE);
        return input;
    }

    getEndEffectorAngle(endEffector) {
        let button4 = this.gamepad.buttons[armMapping.button4].value;
        let button3 = this.gamepad.buttons[armMapping.button3].value;
        let input = button4 - button3;

        input = Math.round(input);
        input += endEffector;
        input = clamp(input, MIN_END_EFFECTOR_ANGLE, MAX_END_EFFECTOR_ANGLE);
        return input;
    }
}
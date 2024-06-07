function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

// speed = 1;                  // left stick up/down
// angle = 2;                  // right stick left/right
// enable_speed = 7;           // right bumper
// spin_mode = 2;              // X
// translate_mode = 3;         // Y
// drive_mode = 1;             // B
// wheel_orientation_0 = 14;   // D-Pad Left
// wheel_orientation_1 = 12;   // D-Pad Up
// wheel_orientation_2 = 15;   // D-Pad Right

export class Xbox360 {
    constructor(gamepad) {
        this.gamepad = gamepad;
    }

    getRotundaAngle(commands) { 
        let input = this.gamepad.axes[this.gamepadInput.leftStickHorizontal];

        input = Math.round(input * 0.55);
        input += commands.rotunda_angle;

        input = clamp(input, MIN_ROTUNDA_ANGLE, MAX_ROTUNDA_ANGLE);
        return input;
    }

    getShoulderAngle(commands) {
        let leftBumperInput = this.gamepad.buttons[this.gamepadInput.leftBumper].value;
        let rightBumperInput = this.gamepad.buttons[this.gamepadInput.rightBumper].value;
        let input = leftBumperInput - rightBumperInput;

        input = Math.round(input);
        input += commands.shoulder_angle;
        input = clamp(input, MIN_SHOULDER_ANGLE, MAX_SHOULDER_ANGLE);
        return input;
    }

    getElbowAngle(commands) {
        let input = this.gamepad.axes[this.gamepadInput.leftStickVertical];

        input = Math.round(input * 0.55);
        input += commands.elbow_angle;

        input = clamp(input, MIN_ELBOW_ANGLE, MAX_ELBOW_ANGLE);
        return input;
    }

    getWristPitchAngle(commands) {
        let input = this.gamepad.axes[this.gamepadInput.rightStickVertical];

        input = Math.round(input * 0.55);
        input += commands.wrist_pitch_angle;

        input = clamp(input, MIN_WRIST_PITCH_ANGLE, MAX_WRIST_PITCH_ANGLE);
        return input;
    }

    getWristRollAngle(commands) {
        let input = this.gamepad.axes[this.gamepadInput.rightStickHorizontal];

        input = Math.round(input * 0.55);
        input += commands.wrist_roll_angle;

        input = clamp(input, MIN_WRIST_ROLL_ANGLE, MAX_WRIST_ROLL_ANGLE);
        return input;
    }

    getEndEffectorAngle(commands) {
        let leftTriggerInput = this.gamepad.buttons[this.gamepadInput.leftTrigger].value;
        let rightTriggerInput = this.gamepad.buttons[this.gamepadInput.rightTrigger].value;
        let input = leftTriggerInput - rightTriggerInput;

        input = Math.round(input);
        input += commands.end_effector_angle;
        input = clamp(input, MIN_END_EFFECTOR_ANGLE, MAX_END_EFFECTOR_ANGLE);
        return input;
    }

    

    // gamepad: Gamepad;
}


// ThrustMaster

// Thrust on Axis 2. Forward goes -1, bacwards go 1

//Thrust toggle thing Axis 6, left is -1, right is 1


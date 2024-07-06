import { useEffect, useRef, useState } from "react";
import { useCommands } from "../contexts/CommandContext";

export default function ControllerConfiguration() {
  const [gamepads, setGamepads] = useState([]);
  const [commands, setCommands] = useCommands();

  let drive = {
    mode: "drive",
    speed: 0,
    angle: 0,
  };

  let arm = {
    speed: 0,
    rotunda: 0,
    elbow: 0,
    shoulder: 0,
    wristPitch: 0,
    wristRoll: 0,
    endEffector: 0,
  };

  let science = { play: true, eStop: false, samplesReceived: false };

  // drive stuff
  let gamepadSpeed = null;
  let gamepadAngle = null;
  let enable_speed_pressed = false;
  let spin_mode = null;
  let translate_mode = null;
  let drive_mode = null;
  let wheel_orientation_0 = null;
  let wheel_orientation_1 = null;
  let wheel_orientation_2 = null;

  let mode = "translate";

  // arm stuff
  let speed = 0;
  let rotunda_trigger_pressed = false;
  let rotunda_trigger = null;
  let rotunda_angle = 0;
  let elbow = 0;
  let shoulder = 0;
  let wristPitch = 0;
  let wristRoll = 0;
  let endEffector = 0;


  useEffect(() => {
    function updateGamepads() {
      const updatedGamepads = Array.from(navigator.getGamepads()).filter(
        (gamepad) => gamepad && gamepad.connected
      );
      setGamepads(updatedGamepads);
    }

    updateGamepads();

    const gamepadHandler = () => {
      updateGamepads();
    };

    window.addEventListener("gamepadconnected", gamepadHandler);

    window.addEventListener("gamepaddisconnected", gamepadHandler);

    return () => {
      window.removeEventListener("gamepaddisconnected", gamepadHandler());
      window.removeEventListener("gamepaddisconnected", gamepadHandler());
    };
  }, []);

  function controllerInput(gamepad) {
    const gamepadId = gamepad.id.toLocaleLowerCase();
    if (
      gamepadId.includes("xbox") ||
      gamepadId.includes("microsoft") ||
      gamepadId.includes("standard gamepad")
    ) {
      // DRIVE CONTROLLER
      const buttons = gamepad.buttons;
      gamepadSpeed = -Math.trunc(5 * gamepad.axes[1]); // -1 is full speed ahead, 1 is full speed backwards
      gamepadAngle += Math.trunc(5 * gamepad.axes[2]); // -1 is left, 1 is right

      enable_speed_pressed = buttons[7].pressed;
      spin_mode = buttons[2].pressed;
      translate_mode = buttons[3].pressed;
      drive_mode = buttons[1].pressed;
      wheel_orientation_0 = buttons[14].pressed;
      wheel_orientation_1 = buttons[12].pressed;
      wheel_orientation_2 = buttons[15].pressed;

      updateDrive();
    } else if (gamepadId.includes("logitech")  || gamepadId.includes("extreme")) {
      // ARM CONTROLLER
      const buttons = gamepad.buttons;
      // console.log(buttons)
      // console.log(gamepad.axes)

      rotunda_trigger_pressed = buttons[0].value;
      rotunda_trigger = gamepad.axes[5];
      // console.log("trigger pressed: " + rotunda_trigger_pressed)
      // console.log("angle: " + rotunda_trigger)
      // shoulder_angle = buttons[4].value - buttons[5].value;
      // console.log(rotunda_angle);    // what if i use axis 5 instead?
      // console.log("shoulder is " + buttons[4].value + " - " + buttons[5].value);

      updateArm();
    } else {
      console.log("gamepad not supported");
      return null;
    }
  }

  function updateDrive() {
    // send over to either manual input or directly to network commands???
    let speed = 0;

    if (enable_speed_pressed) {
      speed = gamepadSpeed;
    } else {
      speed = 0;
    }
    if (spin_mode) {
      mode = "spin";
    }
    if (translate_mode) {
      mode = "translate";
    }
    if (drive_mode) {
      mode = "drive";
    }
    // console.log(mode)
    // console.log(speed)
    // console.log(gamepadAngle)
    // stringify commands
    setCommands((commands) => {
      return JSON.parse(
        JSON.stringify({
          ...commands,
          drive: { mode, speed, angle: gamepadAngle },
        })
      );
    });
  }

  function updateArm() {
    // shoulder

    // elbow
    elbow = 5;

    // rotunda
    if(rotunda_trigger_pressed == 1) {
      rotunda_angle = rotunda_trigger;
      console.log(rotunda_angle)
    }

    console.log({
      ...commands,
      arm: { speed, rotunda: rotunda_angle, elbow, shoulder, wristPitch, wristRoll, endEffector},
    })
    //stringify commands
    setCommands((commands) => {
      return JSON.parse(
        JSON.stringify({
          ...commands,
          arm: { speed, rotunda: rotunda_angle, elbow, shoulder, wristPitch, wristRoll, endEffector},
        })
      );
    });
  }

  function updateScience() {}

  function updateController() {
    for (let i = 0; i < gamepads.length; i++) {
      //   const currentComms = comms.current;
      //   const newComms = controllerInput(gamepads[i])?.getCommands(currentComms);
      controllerInput(navigator.getGamepads()[i]);
      //   if (enable_speed_pressed) {
      // updateDrive();
      // //   }

      // updateArm();
      updateScience();
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateController();
    }, 100);

    return () => clearInterval(interval);
  }, [gamepads]);

  return (
    <div id="ov-gamepad">
      <label>Available Gamepads</label>
      <ul>
        {gamepads.map((gamepad, index) => (
          <li key={gamepad.id}>
            <div>gamepad type: {gamepad.id}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

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

  useEffect(() => {
    function updateGamepads() {
      const updatedGamepads = Array.from(navigator.getGamepads()).filter(
        (gamepad) => gamepad && gamepad.connected
      );
      setGamepads(updatedGamepads);
      //   console.log(navigator.getGamepads()[0]);
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
      //   speed = buttons[1].pressed; // axes???
      //   angle = buttons[2].pressed; // also axes???
      //   console.log(buttons);
      gamepadSpeed = -Math.trunc(5 * gamepad.axes[1]); // -1 is full speed ahead, 1 is full speed backwards
      //   gamepadAngle = Math.trunc(5 * gamepad.axes[2]);
      gamepadAngle += Math.trunc(5 * gamepad.axes[2]); // -1 is left, 1 is right
      //   console.log("speed:" + speed + "angle: " + angle);

      enable_speed_pressed = buttons[7].pressed;
      spin_mode = buttons[2].pressed;
      translate_mode = buttons[3].pressed;
      drive_mode = buttons[1].pressed;
      wheel_orientation_0 = buttons[14].pressed;
      wheel_orientation_1 = buttons[12].pressed;
      wheel_orientation_2 = buttons[15].pressed;
    }
    // else if (gamepadId.includes("logitech")) {
    //   // figure out arm input mappings
    // }
    else {
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

  function updateArm() {}

  function updateScience() {}

  function updateController() {
    for (let i = 0; i < gamepads.length; i++) {
      //   const currentComms = comms.current;
      //   const newComms = controllerInput(gamepads[i])?.getCommands(currentComms);
      controllerInput(navigator.getGamepads()[i]);
    //   if (enable_speed_pressed) {
        updateDrive();
    //   }

      updateArm();
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

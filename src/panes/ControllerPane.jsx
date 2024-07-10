import { useEffect, useRef, useState } from "react";
import { useCommands } from "../contexts/CommandContext";

import ArmGamepad from "../controllers/gamepad"

export default function ControllerConfiguration() {
  const [gamepads, setGamepads] = useState([]);
  const [commands, setCommands] = useCommands();

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

  // Arm Initialization
  let speed = commands.arm.speed;
  let rotunda = commands.arm.rotunda;
  let elbow = commands.arm.elbow;
  let shoulder = commands.arm.shoulder;
  let wristPitch = commands.arm.wristPitch;
  let wristRoll = commands.arm.wristRoll;
  let endEffector = commands.arm.endEffector;

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
      // updateArm(gamepad);
      const armController = new ArmGamepad(gamepad);
      rotunda = armController.getRotundaAngle(rotunda);
      elbow = armController.getElbowAngle(elbow);
      shoulder = armController.getShoulderAngle(shoulder);
      wristPitch = armController.getWristPitchAngle(wristPitch);
      wristRoll = armController.getWristRollAngle(wristRoll);
      endEffector = armController.getEndEffectorAngle(endEffector);

      console.log(rotunda)

      //stringify commands
      setCommands((commands) => {
        return JSON.parse(
          JSON.stringify({
            ...commands,
            arm: { speed, rotunda, elbow, shoulder, wristPitch, wristRoll, endEffector},
          })
        );
      });
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

    setCommands((commands) => {
      return JSON.parse(
        JSON.stringify({
          ...commands,
          drive: { mode, speed, angle: gamepadAngle },
        })
      );
    });
  }

  function updateArm(gamepad) {
    // const armController = new ArmGamepad(gamepad);
    // rotunda = armController.getRotundaAngle(rotunda);
    // elbow = armController.getElbowAngle(elbow);
    // shoulder = armController.getShoulderAngle(shoulder);
    // wristPitch = armController.getWristPitchAngle(wristPitch);
    // wristRoll = armController.getWristRollAngle(wristRoll);
    // endEffector = armController.getEndEffectorAngle(endEffector);

    // console.log(rotunda)

    // //stringify commands
    // setCommands((commands) => {
    //   return JSON.parse(
    //     JSON.stringify({
    //       ...commands,
    //       arm: { speed, rotunda, elbow, shoulder, wristPitch, wristRoll, endEffector},
    //     })
    //   );
    // });
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

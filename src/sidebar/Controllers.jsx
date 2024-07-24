import { Button, Box } from "@mui/material";
import { useEffect, useState } from "react";

import { useCommands } from "../contexts/CommandContext";
import { DriveGamepad, ArmGamepad } from "../controllers/gamepads";

export default function ControllerConfiguration() {
  const [gamepads, setGamepads] = useState([]);
  const [commands, setCommands] = useCommands();

  // Drive Initialization
  let mode = commands.drive.mode;
  let driveSpeed = commands.drive.speed;
  let angle = commands.drive.angle;

  // Arm Initialization
  let armSpeed = commands.arm.speed;
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
      // Updates Drive
      const driveController = new DriveGamepad(gamepad);
      mode = driveController.getMode(mode);
      driveSpeed = driveController.getSpeed(driveSpeed);
      angle = driveController.getAngle(mode);

      setCommands((commands) => {
        return JSON.parse(
          JSON.stringify({
            ...commands,
            drive: { mode, speed: driveSpeed, angle },
          })
        );
      });
    } else if (
      gamepadId.includes("logitech") ||
      gamepadId.includes("extreme")
    ) {
      // TODO Manual Input UI cannot be used when gamepad is connected, including clear button

      // Updates Arm
      const armController = new ArmGamepad(gamepad);
      rotunda = armController.getRotundaAngle(rotunda);
      elbow = armController.getElbowAngle(elbow);
      shoulder = armController.getShoulderAngle(shoulder);
      wristPitch = armController.getWristPitchAngle(wristPitch);
      wristRoll = armController.getWristRollAngle(wristRoll);
      endEffector = armController.getEndEffectorAngle(endEffector);

      setCommands((commands) => {
        return JSON.parse(
          JSON.stringify({
            ...commands,
            arm: {
              speed: armSpeed,
              rotunda,
              elbow,
              shoulder,
              wristPitch,
              wristRoll,
              endEffector,
            },
          })
        );
      });
    } else {
      console.log("gamepad not supported");
      return null;
    }
  }

  function updateScience() {}

  function updateController() {
    for (let i = 0; i < gamepads.length; i++) {
      controllerInput(navigator.getGamepads()[i]);
      updateScience(); // Placeholder for Science system
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateController();
    }, 100);

    return () => clearInterval(interval);
  }, [gamepads]);


  return (
    <Box sx={{ width: 1, height: 1, position: "relative" }}>
      <div id="ov-gamepad">
        <label>Available Gamepads</label>
        <ul>
          {gamepads.map((gamepad, index) => (
            <li key={gamepad.id}>
              <div>{gamepad.id}</div>
            </li>
          ))}
        </ul>
      </div>
    </Box>
  );
} 
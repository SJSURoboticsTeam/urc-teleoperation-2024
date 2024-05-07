import React, { useState, useEffect, useRef, useContext } from 'react';
import { ArmCommandDTO, DriveCommandDTO } from '../../util/command-dto';
import { driveStringFormat, armStringFormat } from '../../util/command-formats';
import { LogitechExtreme, Xbox360 } from '../../controllers/arm/gamepad';
import { useGamepads } from 'react-gamepads';
import { useCommands } from '../contexts/CommandContext';
// IMPORT COMMANDS
import DriveController from '../../controllers/drive/controller';
import Wifi from '../Wifi';

export default function ControllerConfiguration() {
//   const driveCommands = useRef<string>(driveStringFormat(DEFAULT_DRIVE_COMMANDS));
//   const armCommands = useRef<string>(armStringFormat(DEFAULT_ARM_COMMANDS));
  const [gamepads, setGamepads] = useState([]);
  const [modes, setModes] = useState([]);
  const [isWifiConnected, setIsWifiConnected] = useState(Array(gamepads.length).fill(false)); //used to disable the select to avoid abrupt switching
  const [commands, setCommands] = useContext()

//   const driveCommandsRef = useRef<DriveCommandDTO>(DEFAULT_DRIVE_COMMANDS);
//   const armCommandsRef = useRef<ArmCommandDTO>(DEFAULT_ARM_COMMANDS);
//   const [status, setStatus] = useState<ArmCommandDTO | DriveCommandDTO>();
  const gamepadsRef = useRef(gamepads);

  useGamepads((gamepads) => {
    if (gamepads[0]) {
      const connectedGamepads = Object.values(gamepads).filter((gamepad) => gamepad && gamepad.connected);
      setGamepads(connectedGamepads);
    }

  });

  useEffect(() => {
    const updateGamepads = () => { // handles the connection of gamepads so component is rendered correctly
      const updatedGamepads = Array.from(navigator.getGamepads()).filter((gamepad) => gamepad && gamepad.connected);
      setGamepads(updatedGamepads);
    };
  
    updateGamepads();
  
    const gamepadHandler = () => {
      updateGamepads();
    };
  
    window.addEventListener('gamepadconnected', gamepadHandler);
    window.addEventListener('gamepaddisconnected', gamepadHandler);
  
    return () => {
      window.removeEventListener('gamepadconnected', gamepadHandler);
      window.removeEventListener('gamepaddisconnected', gamepadHandler);
    };
  }, []);
 
  useEffect(() => {
    gamepadsRef.current = gamepads;
  }, [gamepads]);


  function updateDriveCommands(newCommands) {
    driveCommandsRef.current = newCommands;
    driveCommands.current= driveStringFormat(newCommands);
  }

  function updateArmCommands (newCommands) {
    armCommandsRef.current = newCommands;
    armCommands.current = armStringFormat(newCommands);
  }

  function getGamePad(gamepad) {
    if (!gamepad) {
      return null;
    }
    const gamePadID = gamepad.id.toLowerCase();
    if (gamePadID.includes('xbox') || gamePadID.includes('microsoft')) {
      return new Xbox360(gamepad);
    } else if (gamePadID.includes('logitech')) {
      return new LogitechExtreme(gamepad);
    } else {
      return null;
    }
  }

  function updateController() {
    
    for (let i = 0; i < gamepads.length; i++){
      
      if (modes[i] === 'Drive') {
        const currentCommands = driveCommandsRef.current;
        const newCommands = new DriveController(gamepadsRef.current[i])?.getCommands(currentCommands);
        updateDriveCommands({...newCommands});
      } else if (modes[i] === 'Arm') {
          let controller = getGamePad(gamepadsRef.current[i]);
          if (!controller) {
            console.log('controller model not supported');
            return armCommandsRef.current;
          }
          const currentCommands = armCommandsRef.current;
          const newCommands = {
            rotunda_angle: controller.getRotundaAngle(currentCommands),
            shoulder_angle: controller.getShoulderAngle(currentCommands),
            elbow_angle: controller.getElbowAngle(currentCommands),
            wrist_roll_angle: controller.getWristRollAngle(currentCommands),
            end_effector_angle: controller.getEndEffectorAngle(currentCommands)
          };
  
          updateArmCommands({...armCommandsRef.current, ...newCommands});
      }

    }
  }

  function updateWifiStatus(index, status) {
    setIsWifiConnected(prev => {
        const updatedStatus = [...prev];
        updatedStatus[index] = status;
        return updatedStatus;
    });
}

  const handleModeChange = (gamepadInstance, mode) => {
    setModes((prevModes) => {
      const index = gamepads.findIndex((gp) => gp.id === gamepadInstance.id);
      const updatedModes = [...prevModes];
      if (mode === "None") {
        updatedModes[index] = undefined;
      } else {
        updatedModes[index] = mode; // Update the mode
      }
      
      return updatedModes;
    });
  };


  useEffect(() => {
    updateController();
  }, [modes, gamepads]);

  

  return (
    <div id="ov-gamepad">
      <label>Available Gamepads</label>
      <ul>
        {gamepads.map((gamepad, index) => (
          <li key={gamepad.id}>
            <div>
            
              {gamepad.id.includes("Logitech") ? "Logitech" : "Xbox"}:
            </div>
            <div>
              <select className="btn" 
              onChange={(e) => handleModeChange(gamepad, e.target.value)}
              disabled={isWifiConnected[index]}>
                <option value="None">none</option>
                <option value="Drive">Drive</option>
                <option value="Arm">Arm</option>
              </select>
            </div>
            

            {modes[index] === "Drive" && (
            <div>
              <Wifi
                commands={driveCommands}
                setStatus={setStatus}
                wifiConfigConnect={(status) => updateWifiStatus(index, status)}
                endpoint="drive"
              />
            </div>
          )}
          {modes[index] === "Arm" && (
            <div>
              <Wifi
                commands={armCommands}
                setStatus={setStatus}
                wifiConfigConnect={(status) => updateWifiStatus(index, status)}
                endpoint="arm"
              />
            </div>
          )}
          </li>
        ))}
      </ul>
      
  
    </div>
    
  );
}
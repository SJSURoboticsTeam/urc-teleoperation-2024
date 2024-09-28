import * as React from 'react';
import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import { useCommands } from '../contexts/CommandContext'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';






export default function MimicPane({style}) {

    const [commands,setCommands] = useCommands()
    const [serialPort, setSerialPort] = useState(null)

    const armControlConfigs = [
        { name: 'speed', label: 'Speed', min: 0, max: 5 },
        { name: 'rotunda', label: 'Rotunda', min: -180, max: 180 },
        { name: 'elbow', label: 'Elbow', min: -75, max: 90 },
        { name: 'shoulder', label: 'Shoulder', min: -45, max: 90 },
        { name: 'wristPitch', label: 'Wrist Pitch', min: -90, max: 90 },
        { name: 'wristRoll', label: 'Wrist Roll', min: -180, max: 180 },
        { name: 'endEffector', label: 'End Effector', min: 0, max: 90 }
    ]

    

    const getSerialPort = () => {
        navigator.serial.requestPort()
            .then((port) => {
                port.open({baudRate: 9600}).then(() => {
                    
                    
                    port.addEventListener('disconnect', () => {
                        setSerialPort(null)
                    })
                    
                    setSerialPort(port)
                })

                
            })
            .catch((e) => {
                
            });
    }

    const readSerialData = async () => {
        if (serialPort) {
            
            const reader = serialPort.readable.getReader();
            const textDecoder = new TextDecoder('utf-8')
            
            try {
                let command = ""
                while (true) {
                    const{value, done} = await reader.read();
                    command += textDecoder.decode(value)
                    if (command.includes("}"))
                        break;
                }

                command = JSON.parse(command)
                console.log(command)
                
            } catch (error) {
                
            } finally {
                reader.releaseLock()
            }
            setTimeout(readSerialData,100)
        }
        
    }

    useEffect(() => {
        readSerialData()
    }, [serialPort])

    return (
        <Box style={style}>
            <Button onClick={getSerialPort}>Connect</Button>
            

        </Box>
    )
}
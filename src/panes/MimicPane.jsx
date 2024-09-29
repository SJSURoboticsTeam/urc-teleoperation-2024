import * as React from 'react';
import { useEffect, useState, useRef } from 'react'
import TextField from '@mui/material/TextField'
import { useCommands } from '../contexts/CommandContext'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'



export default function MimicPane({style}) {

    const [commands,setCommands] = useCommands()
    const portRef = useRef(null)
    const readSerial = useRef(true)

    const getSerialPort = () => {

        console.log("hmmm")
        navigator.serial.requestPort()
            .then((port) => {
                port.open({baudRate: 9600}).then(() => {
                    
                    
                    port.addEventListener('disconnect', () => {
                        portRef.current = null
                    })
                    
                    portRef.current = port
                    readSerialData()
                })
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const readSerialData = async () => {
        if (portRef.current && readSerial.current) {
            const reader = portRef.current.readable.getReader();
            const textDecoder = new TextDecoder('utf-8')
            try {
 
                let serialInput = ""
                while (!serialInput.includes("}")) {
                    const{value, done} = await reader.read();
                    serialInput += textDecoder.decode(value)
                }

                let armCommand = JSON.parse(serialInput)
            
                setCommands((commands) => {
                    let newCommands = {...commands}
                    newCommands['arm']['speed'] = armCommand['speed']
                    newCommands['arm']['rotunda'] = armCommand['angles'][0]
                    newCommands['arm']['shoulder'] = armCommand['angles'][1]
                    newCommands['arm']['elbow'] = armCommand['angles'][2]
                    newCommands['arm']['wristPitch'] = armCommand['angles'][3]
                    newCommands['arm']['wristRoll'] = armCommand['angles'][4]
                    newCommands['arm']['endEffector'] = armCommand['angles'][5]
                    //angles: [$ROTUNDA, $SHOULDER, $ELBOW, $WRIST_PITCH, $WRIST_ROLL, $END_EFFECTOR]
                    return newCommands
                })
                
            } catch (error) {
                console.log(error)

            } finally {
                reader.releaseLock()
            }
            setTimeout(readSerialData,100)
        }
        
    }
    const wait = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    
    useEffect(() => {
        readSerial.current = true
        return async () => {
            readSerial.current = false
            if (portRef.current) {
                while (portRef.current.readable.locked) {await wait(0)}
                portRef.current.close()
                portRef.current = null
            }
        }
    },[])

    return (
        <Box style={style}>
            <Button onClick={getSerialPort}>Connect</Button>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
                {Object.keys(commands['arm']).map(key => (
                    <TextField
                        id="filled-read-only-input"
                        label={key}
                        value={commands['arm'][key]}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                ))}
            </Box>
            
        </Box>
    )
}
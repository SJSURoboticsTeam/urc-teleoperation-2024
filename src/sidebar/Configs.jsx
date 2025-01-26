import { armToCan, driveToCan } from '../utils/Translation.jsx'
import Box from '@mui/material/Box'

import { useCommands } from '../contexts/CommandContext'
import { useEffect, useState } from 'react'
import { Button, Input } from '@mui/material'
import { io } from 'socket.io-client';

export default function Configs() {
    const [commands] = useCommands()
    const [isConnected, setIsConnected] = useState(false)
    const [serverAddress, setServerAddress] = useState("http://localhost:4000")
    const [socket, setSocket] = useState(null)

    const setStatus = (status) => {
        console.log(status)
    }

    const connect = () => {
        const connection = io(serverAddress, {transports: ['websocket'],}); // new socket connection
        setSocket(connection) // set socket instance
    }

    useEffect(() => {
        if (socket !== null) {
            socket.on('connect', () => {
                setIsConnected(true)
            })
            socket.on('disconnct', () => {
                setIsConnected(false)
            })
            socket.on('commands status', (data) => {
                setStatus(JSON.stringify(data))
            })
        }
    },[socket])

    function disconnect() {
        if (socket) {
            socket.disconnect()
        }
        setIsConnected(false)
    }

    async function writeCommands() {
        if (isConnected && socket) {
            try {
                // Translating from JSON to CAN
                // send over an array or object of the string commands
                let canCommands = []
                let armCan = armToCan(commands.arm)
                armCan.forEach(element => {
                    canCommands.push(element)
                });
                let driveCan = driveToCan(commands.drive)
                driveCan.forEach(element => {
                    canCommands.push(element)
                })
                
                socket.emit('post commands', canCommands) // commands has to be formatted the way the server wants
            }
            catch (error) {
                disconnect()
                console.log(error)
                setStatus("Unable to post commands, verify backend is running")
            }
        }
    }

    useEffect(() => {
        const writeInterval = setInterval(() => {
            if (isConnected) {
                writeCommands()
            }
        }, 200)
        return () => clearInterval(writeInterval)
    }, [isConnected, commands])

    return (
        <Box sx={{ width: 1, height: 1, position: 'relative' }}>
            {isConnected ? <Button className='btn btn__danger' onClick={disconnect}>Disconnect</Button>
                : <Button className='btn btn__primary' onClick={connect}>Connect</Button>}
            <Input fullWidth helperText='Enter server ip' autoComplete='off' className='input-text' type='text' value={serverAddress} onChange={e => setServerAddress(e.target.value)} />
        </Box>
    )
}

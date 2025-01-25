import Box from '@mui/material/Box'
// import axios from 'axios'
import { useCommands } from '../contexts/CommandContext'
import { useEffect, useState } from 'react'
import { Button, Input } from '@mui/material'

import { io } from 'socket.io-client';

// export const socket = io(serverAddress, {
//     autoConnect: false
// });
// const socket = io("https://server-domain.com");

export default function Configs() {
    const [commands] = useCommands()
    const [isConnected, setIsConnected] = useState(false)
    const [serverAddress, setServerAddress] = useState("http://localhost:4000")
    const [socket, setSocket] = useState(null)

    const setStatus = (status) => {
        console.log(status)
    }

    function connect() {
        const socket = io(serverAddress) // new socket connection
        setSocket(socket) // set socket instance
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

    function disconnect() {
        if (socket) {
            socket.disconnect()
        }
        setIsConnected(false)
    }

    async function writeCommands() {
        if (isConnected && socket) {
            try {
                socket.emit('post commands', commands) // commands has to be formatted the way the server wants
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

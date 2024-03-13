import Box from '@mui/material/Box'
import axios from 'axios'
import { useCommands } from '../contexts/CommandContext'
import { useEffect, useState } from 'react'

export default function WifiPane ({ style }) {
        const [commands] = useCommands()
        const [isConnected, setIsConnected] = useState(false)
        const [serverAddress, setServerAddress] = useState("http://localhost:5000/endpoint")
        
        const setStatus = (status) => {
            console.log(status)
        }

        function connect() {
            setIsConnected(true)
        }
    
        function disconnect() {
            setIsConnected(false)
        }
    
        async function writeCommands() {
            if (isConnected) {
                try {
                    const responseStatus = await axios.post(serverAddress, commands) //commands no worky
                    setStatus(responseStatus.data)
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
        }, [isConnected])

  return (
    <Box
      sx={{ width: 1, height: 1, position: 'relative' }}
      style={style}
    >
        <input autoComplete='off' className='input-text' type='text' value={serverAddress} onChange={e => setServerAddress(e.target.value)} />
            {isConnected ? <button className='btn btn__danger' onClick={disconnect}>Disconnect</button>
                : <button className='btn btn__primary' onClick={connect}>Connect</button>}
    </Box>
  )
}
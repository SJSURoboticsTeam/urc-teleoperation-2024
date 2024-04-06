import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useCommands } from '../contexts/CommandContext'
import { useEffect, useState } from 'react'
import { Button, Input } from '@mui/material'

export default function Configs () {
    const [commands] = useCommands()
        const [isConnected, setIsConnected] = useState(false)
        const [serverAddress, setServerAddress] = useState("http://localhost:5000/commands")
        
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
                    const responseStatus = await axios.post(serverAddress, commands)
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
        }, [isConnected, commands])

  return (
    <Box sx={{ width: 1, height: 1, position: 'relative' }}>
        {isConnected ? <Button className='btn btn__danger' onClick={disconnect}>Disconnect</Button>
                : <Button className='btn btn__primary' onClick={connect}>Connect</Button>}
      {/* {isConnected ? <Button className='btn btn__danger' onClick={disconnect}>Disconnect</Button>
                : <Button className='btn btn__primary' onClick={connect}>Connect</Button>} */}
      <Input fullWidth helperText='Enter server ip' autoComplete='off' className='input-text' type='text' value={serverAddress} onChange={e => setServerAddress(e.target.value)} />
    </Box>
  )
}

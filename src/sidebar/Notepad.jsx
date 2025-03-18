import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useState } from 'react'
import { useEffect } from 'react'

export default function Notepad () {
  const [text, setText] = useState(' ');
  const [inputVal, setInputVal] = useState(JSON.parse(localStorage.getItem("note")) || [])

  const handleSubmit=(event)=>{
    event.preventDefault();
    setText(inputVal);
    console.log(inputVal)
    localStorage.setItem('text',inputVal)
  }

  return (
    <Box sx={{ width: 1, height: 1, position: 'relative' }}>
      <Typography>
        <form onSubmit={handleSubmit}>
          <label>
            <input type="text"
            onChange = {(e) => setInputVal(e.target.value)}
            value ={inputVal}/>
          </label>
          <button type="submit">Submit</button>
        </form>
        {text && <p>Your notes: {text}</p>}
      </Typography>
    </Box>
  )

    
}

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useState } from 'react'
import { useEffect } from 'react'

export default function Notepad () {
  const [text, setText] = useState(' ');
  const [inputVal, setInputVal] = useState(JSON.parse(localStorage.getItem("note")) || [])
  
  useEffect(() => {
    setText(localStorage.getItem('text') || ''); 
  }, []);
  const handleSubmit=(event)=> {
    event.preventDefault();
    console.log(inputVal)
    let output = inputVal + "\n" + text;
    setText(output);
    console.log(output)
    localStorage.setItem('text', output)
    setInputVal(' ');
  }
  const clearStorage = () => {
      localStorage.removeItem('text');
      setText([])
  }
  return (
    <Box sx={{ width: 1, height: 1, position: 'relative' }}>
      <Typography>
        <form onSubmit={handleSubmit}>
          <label>
            <textarea 
            name = "text"
            rows = "5"
            cols = "50"
            onChange = {(e) => setInputVal(e.target.value)}
            value ={inputVal}
            />
          </label>
          <button type="submit">Submit</button>
          <button type ="button"onClick = {()=>{clearStorage()}}> Clear</button>
        </form>
        <p>Your notes:<br/> 
        <p dangerouslySetInnerHTML={{ __html: text.toString().replace(/\n/g, '<br />') }} /> 
        </p>
      </Typography>
    </Box>
  )

    
}

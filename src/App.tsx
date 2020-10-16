import React, { useState } from 'react'
import logo from './logo.svg'
import { load } from './net'
import { init, initWithData } from './ram'
import './App.css'

function App() {
  let ram = init()

  const [filename, setFilename] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(event.target.value)
  }

  const loadFile = () => {
    load(filename).then((data: Uint8Array) => {
      ram = initWithData(data)
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <input value={filename} onChange={handleChange} />
        <button onClick={loadFile}>Load</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>RAM: {ram.length} bytes</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App

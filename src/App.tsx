import React, { useState, useEffect, useCallback } from 'react'
import logo from './logo.svg'
import { load } from './net'
import { create, createWithData } from './memory'
import './App.css'

function App() {
  let mem = create()

  const [filename, setFilename] = useState(
    'https://johnearnest.github.io/chip8Archive/roms/octojam1title.ch8'
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(event.target.value)
  }

  const loadFile = useCallback(() => {
    load(filename).then((data: Uint8Array) => {
      mem = createWithData(data)
    })
  }, [])

  useEffect(() => {
    loadFile()
  }, [loadFile])

  return (
    <div className="App">
      <header className="App-header">
        <div className="file">
          <input value={filename} onChange={handleChange} />
          <button onClick={loadFile}>Load</button>
        </div>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  )
}

export default App

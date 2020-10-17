import React, { useState, useEffect, useCallback } from 'react'
import logo from './logo.svg'
import { load } from './chip-8/net'
import { create, createWithData } from './chip-8/memory'
import './App.css'
import CurrentStep from './CurrentStep'

const App = () => {
  let [mem, setMem] = useState(create())

  const [filename, setFilename] = useState(
    'https://johnearnest.github.io/chip8Archive/roms/octojam1title.ch8'
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(event.target.value)
  }

  const loadFile = useCallback(() => {
    load(filename).then((data: Uint8Array) => {
      setMem(createWithData(data))
    })
  }, [filename])

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
        <CurrentStep mem={mem} />
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  )
}

export default App

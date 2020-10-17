import React, { useState, useEffect, useCallback } from 'react'
import { load } from './chip-8/net'
import { create, createWithData, step } from './chip-8/memory'
import './App.css'
import Display from './Display'
import CurrentStep from './CurrentStep'
import Registers from './Registers'

const App = () => {
  const [mem, setMem] = useState(create())
  const [run, setRun] = useState(false)

  const [filename, setFilename] = useState(
    'https://johnearnest.github.io/chip8Archive/roms/octojam1title.ch8'
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (run) setMem(step(mem))
    })
    return () => clearInterval(interval)
  }, [mem, run])

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

  const handleStep = () => {
    setMem(step(mem))
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="file">
          <input value={filename} onChange={handleChange} />
          <button onClick={loadFile}>Load</button>
          <button onClick={handleStep}>Step</button>
          <input type="checkbox" onClick={() => setRun(!run)} />
        </div>
        <CurrentStep mem={mem} />
        <Registers mem={mem} />
        <Display mem={mem} />
      </header>
    </div>
  )
}

export default App

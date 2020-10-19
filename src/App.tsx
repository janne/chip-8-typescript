import React, { useState, useEffect, useCallback } from 'react'
import { load } from './chip-8/net'
import { create, createWithData, step } from './chip-8/memory'
import './App.css'
import Display from './Display'
import Registers from './Registers'
import useKeyPress from './useKeyPress'

const App = () => {
  const [mem, setMem] = useState(create())
  const [running, setRunning] = useState(false)
  const key = useKeyPress()

  const [filename, setFilename] = useState(
    'https://johnearnest.github.io/chip8Archive/roms/snake.ch8'
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(event.target.value)
  }

  const loadFile = useCallback(() => {
    load(filename)
      .then((data: Uint8Array) => {
        setMem(createWithData(data))
        setRunning(false)
      })
      .catch((e) => console.log('Something went wrong', e))
  }, [filename])

  useEffect(() => {
    loadFile()
  }, [loadFile])

  const handleStep = () => {
    if (!running) setMem(step(mem, true))
  }

  useEffect(() => {
    let timerId: number

    const f = () => {
      setMem((mem) =>
        Array(8)
          .fill(null)
          .reduce((memo) => step(memo), mem)
      )
      timerId = requestAnimationFrame(f)
    }

    timerId = requestAnimationFrame(f)

    return () => cancelAnimationFrame(timerId)
  }, [])

  useEffect(() => {
    setMem((mem) => ({ ...mem, pressedKey: key }))
  }, [key])

  useEffect(() => {
    setMem((mem) => ({ ...mem, running }))
  }, [running])

  return (
    <div className="App">
      <header className="App-header">
        <div className="file">
          <input value={filename} onChange={handleChange} />
          <button onClick={loadFile}>Load</button>
          <button onClick={handleStep} disabled={running}>
            Step
          </button>
          <button onClick={() => setRunning(!running)}>
            {running ? 'Stop' : 'Run'}
          </button>
        </div>
        <Display mem={mem} />
        {!running && <Registers mem={mem} />}
      </header>
    </div>
  )
}

export default App

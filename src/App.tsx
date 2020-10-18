import React, { useState, useEffect, useCallback } from 'react'
import { load } from './chip-8/net'
import { create, createWithData, step } from './chip-8/memory'
import './App.css'
import Display from './Display'
import Registers from './Registers'

const App = () => {
  const [mem, setMem] = useState(create())
  const [run, setRun] = useState(false)

  const [filename, setFilename] = useState('/test_opcode.ch8')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(event.target.value)
  }

  const loadFile = useCallback(() => {
    load(filename)
      .then((data: Uint8Array) => {
        setMem(createWithData(data))
      })
      .catch((e) => console.log('Something went wrong', e))
  }, [filename])

  useEffect(() => {
    loadFile()
  }, [loadFile])

  const handleStep = () => {
    setMem(step(mem))
  }

  useEffect(() => {
    if (!run) return
    let timerId: number

    const f = () => {
      for (let i = 0; i < 8; i++) {
        setMem((mem) => step(mem))
      }

      timerId = requestAnimationFrame(f)
    }

    timerId = requestAnimationFrame(f)

    return () => cancelAnimationFrame(timerId)
  }, [run])

  return (
    <div className="App">
      <header className="App-header">
        <div className="file">
          <input value={filename} onChange={handleChange} />
          <button onClick={loadFile}>Load</button>
          <button onClick={handleStep}>Step</button>
          <button onClick={() => setRun(!run)}>{run ? 'Stop' : 'Run'}</button>
        </div>
        <Registers mem={mem} />
        <Display mem={mem} />
      </header>
    </div>
  )
}

export default App

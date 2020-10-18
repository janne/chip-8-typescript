import React, { useRef } from 'react'
import { useLayoutEffect } from 'react'
import { Memory } from './chip-8/memory'
import './Display.css'

interface Props {
  mem: Memory
}

const Display = ({ mem }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    const context = canvasRef.current?.getContext('2d')
    if (!context) return
    mem.display.forEach((row, y) =>
      row.forEach((on, x) => {
        context.fillStyle = on ? '#ccc' : '#333'
        context.fillRect(x * 10, y * 10, (x + 1) * 10, (y + 1) * 10)
      })
    )
  }, [mem.display])

  return <canvas ref={canvasRef} width={640} height={320}></canvas>
}

export default Display

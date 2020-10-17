import React from 'react'
import { currentInstruction, Memory, programCounter } from './chip-8/memory'

interface Props {
  mem: Memory
}

const CurrentStep = ({ mem }: Props) => {
  const instruction = Array.from(currentInstruction(mem))
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')

  return (
    <div>
      {programCounter(mem).toString(16)}: {instruction}
    </div>
  )
}

export default CurrentStep

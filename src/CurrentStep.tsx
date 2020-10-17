import React from 'react'
import { currentOpcode, Memory, programCounter } from './chip-8/memory'

interface Props {
  mem: Memory
}

const CurrentStep = ({ mem }: Props) => {
  const pc = programCounter(mem).toString(16)
  const opcode = currentOpcode(mem).toString(16).padStart(4, '0')

  return (
    <div>
      {pc}: {opcode}
    </div>
  )
}

export default CurrentStep

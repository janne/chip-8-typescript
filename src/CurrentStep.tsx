import React from 'react'
import { getMnemonic } from './chip-8/instructions'
import { currentOpcode, Memory, programCounter } from './chip-8/memory'

interface Props {
  mem: Memory
}

const CurrentStep = ({ mem }: Props) => {
  const pc = programCounter(mem)
  const opcode = currentOpcode(mem)
  const mnemonic = getMnemonic(opcode)

  return (
    <div>
      {pc.toString(16).toUpperCase()}:{' '}
      {opcode.toString(16).padStart(4, '0').toUpperCase()}: {mnemonic}
    </div>
  )
}

export default CurrentStep

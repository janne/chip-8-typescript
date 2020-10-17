import React from 'react'
import { currentInstruction, Memory } from './chip-8/memory'

interface Props {
  mem: Memory
}

const CurrentStep = ({ mem }: Props) => <div>{currentInstruction(mem)}</div>

export default CurrentStep

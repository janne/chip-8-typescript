import React from 'react'
import { Memory } from './chip-8/memory'

interface Props {
  mem: Memory
}

const Registers = ({ mem }: Props) => {
  return (
    <div>
      <table>
        <tr>
          {Array.from(mem.registers).map((_, i) => (
            <th>{i.toString(16)}</th>
          ))}
          <th>PC</th>
          <th>I</th>
        </tr>
        <tr>
          {Array.from(mem.registers).map((r) => (
            <td>{r.toString(16).padStart(2, '0')}</td>
          ))}
          <td>{mem.programCounter.toString(16).padStart(3, '0')}</td>
          <td>{mem.indexRegister.toString(16).padStart(3, '0')}</td>
        </tr>
      </table>
    </div>
  )
}

export default Registers

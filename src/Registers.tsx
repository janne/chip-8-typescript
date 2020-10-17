import React from 'react'
import { Memory } from './chip-8/memory'

interface Props {
  mem: Memory
}

const Registers = ({ mem }: Props) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            {Array.from(mem.registers).map((_, i) => (
              <th key={`header-${i}`}>{i.toString(16)}</th>
            ))}
            <th>PC</th>
            <th>I</th>
            <th>DT</th>
            <th>ST</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {Array.from(mem.registers).map((r, i) => (
              <td key={`data-${i}`}>{r.toString(16).padStart(2, '0')}</td>
            ))}
            <td>{mem.programCounter.toString(16).padStart(3, '0')}</td>
            <td>{mem.indexRegister.toString(16).padStart(3, '0')}</td>
            <td>{mem.delayTimer.toString(8).padStart(2, '0')}</td>
            <td>{mem.soundTimer.toString(8).padStart(2, '0')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Registers

import React from 'react'
import { getMnemonic } from './chip-8/instructions'
import { currentOpcode, Memory } from './chip-8/memory'
import './Registers.css'

interface Props {
  mem: Memory
}

const Registers = ({ mem }: Props) => (
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
          <th className="mnemonic">Mnemonic</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {Array.from(mem.registers).map((r, i) => (
            <td key={`data-${i}`}>{r.toString(16).padStart(2, '0')}</td>
          ))}
          <td>{mem.programCounter.toString(16).padStart(3, '0')}</td>
          <td>{mem.indexRegister.toString(16).padStart(3, '0')}</td>
          <td>{mem.delayTimer.toString(16).padStart(2, '0')}</td>
          <td>{mem.soundTimer.toString(16).padStart(2, '0')}</td>
          <td>{getMnemonic(currentOpcode(mem))}</td>
        </tr>
      </tbody>
    </table>
  </div>
)

export default Registers

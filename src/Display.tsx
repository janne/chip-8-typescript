import React from 'react'
import { Memory } from './chip-8/memory'
import './Display.css'

interface Props {
  mem: Memory
}

const Display = ({ mem }: Props) => (
  <table className="Display">
    <tbody>
      {mem.display.map((row, i) => (
        <tr key={`row_${i}`}>
          {row.map((cell, j) => (
            <td
              key={`cell-${j}`}
              className={cell ? 'Display-cellOn' : 'Display-cellOff'}
            />
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)

export default Display

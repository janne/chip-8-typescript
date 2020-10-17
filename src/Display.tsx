import React from 'react'
import { Memory } from './chip-8/memory'
import './Display.css'

interface Props {
  mem: Memory
}

const Display = ({ mem }: Props) => (
  <table className="Display">
    {mem.display.map((row) => (
      <tr>
        {row.map((cell) => (
          <td className={cell ? 'Display-cellOn' : 'Display-cellOff'} />
        ))}
      </tr>
    ))}
  </table>
)

export default Display

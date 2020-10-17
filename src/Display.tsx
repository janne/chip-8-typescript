import React from 'react'
import './Display.css'

interface Props {
  vram: Array<Array<boolean>>
}

const Display = ({ vram }: Props) => (
  <table className="Display">
    {vram.map((row) => (
      <tr>
        {row.map((cell) => (
          <td className={cell ? 'Display-cellOn' : 'Display-cellOff'} />
        ))}
      </tr>
    ))}
  </table>
)

export default Display

import { useState, useEffect } from 'react'

const keyMap: { [k: string]: number } = {
  '1': 0x1,
  '2': 0x2,
  '3': 0x3,
  '4': 0xc,
  q: 0x4,
  w: 0x5,
  e: 0x6,
  r: 0xd,
  a: 0x7,
  s: 0x8,
  d: 0x9,
  f: 0xe,
  z: 0xa,
  x: 0x0,
  c: 0xb,
  v: 0xf,
}

const useKeyPressed = () => {
  const [keyPressed, setKeyPressed] = useState<number | null>(null)

  function downHandler({ key }: KeyboardEvent) {
    if (Object.keys(keyMap).includes(key)) {
      setKeyPressed(keyMap[key])
    }
  }

  const upHandler = ({ key }: KeyboardEvent) => {
    if (Object.keys(keyMap).includes(key)) {
      setKeyPressed(null)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [])

  return keyPressed
}

export default useKeyPressed

import { execute } from './instructions'
import font from './font'

export const SIZE = 0x1000
const START = 0x200

export interface Memory {
  ram: Uint8Array
  programCounter: number
  registers: Uint8Array
  indexRegister: number
  stack: number[]
  soundTimer: number
  delayTimer: number
  display: boolean[][]
  pressedKey: number | null
}

export const create = (): Memory => {
  const ram = new Uint8Array(SIZE)
  ram.set(font)
  return {
    registers: new Uint8Array(16),
    ram,
    indexRegister: 0,
    stack: [],
    soundTimer: 0,
    delayTimer: 0,
    programCounter: START,
    display: emptyDisplay(),
    pressedKey: null,
  }
}

export const emptyDisplay = () => new Array(32).fill(new Array(64).fill(false))

export const createWithData = (data: Uint8Array, to: number = START) => {
  if (data.length + to > SIZE) throw new Error('Data overflow')
  const mem = create()
  mem.ram.set(data, START)
  return mem
}

export const currentOpcode = (mem: Memory) => {
  const p = mem.ram.slice(mem.programCounter, mem.programCounter + 2)
  return (p[0] << 8) + p[1]
}

export const programCounter = (mem: Memory) => mem.programCounter

const getTimerDecreaser = () => {
  let tick = 0
  return (mem: Memory) => {
    tick = (tick + 1) % 8
    if (tick > 0) return mem
    return {
      ...mem,
      delayTimer: mem.delayTimer > 0 ? mem.delayTimer - 1 : 0,
      soundTimer: mem.soundTimer > 0 ? mem.soundTimer - 1 : 0,
    }
  }
}

const decreaseTimers = getTimerDecreaser()

export const step = (mem: Memory): Memory =>
  decreaseTimers(execute(mem, currentOpcode(mem)))

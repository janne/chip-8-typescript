const SIZE = 0x1000
const START = 0x200

export interface Memory {
  ram: Uint8Array
  programCounter: number
  registers: Uint8Array
  indexRegister: number
  stack: Array<number>
  soundTimer: number
  delayTimer: number
}

export const create = (): Memory => ({
  registers: new Uint8Array(16),
  ram: new Uint8Array(SIZE),
  indexRegister: 0,
  stack: [],
  soundTimer: 0,
  delayTimer: 0,
  programCounter: START,
})

export const createWithData = (
  data: Uint8Array,
  to: number = START
): Memory => {
  if (data.length + to > SIZE) throw new Error('Data overflow')
  const mem = create()
  mem.ram.set(data, START)
  return mem
}

export const currentInstruction = (mem: Memory) =>
  Array.from(mem.ram.slice(mem.programCounter, mem.programCounter + 2))
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')

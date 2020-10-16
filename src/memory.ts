interface Memory {
  ram: Uint8Array
  programCounter: number
  registers: Uint8Array
  indexRegister: number
  stack: Array<number>
  soundTimer: number
  delayTimer: number
}

const SIZE = 0x1000
const START = 0x200

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
  mem.ram.set(data)
  return mem
}

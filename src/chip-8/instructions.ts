import { emptyDisplay, Memory, SIZE } from './memory'

interface Opcode {
  pattern: number
  mask: number
  mnemonic: (...args: string[]) => string
  arguments?: string
  exec: (mem: Memory, ...args: number[]) => Memory
}

const instructions: Array<Opcode> = [
  {
    // Clear the display
    pattern: 0x00e0,
    mask: 0xffff,
    mnemonic: () => 'CLS',
    exec: (mem) => ({ ...mem, display: emptyDisplay() }),
  },
  {
    // Return from a subroutine
    pattern: 0x00ee,
    mask: 0xffff,
    mnemonic: () => 'RET',
    exec: (mem) => {
      if (mem.stack.length === 0) throw new Error('Stack underflow')
      mem.programCounter = mem.stack[0]
      mem.stack = mem.stack.slice(1)
      return mem
    },
  },
  {
    // Jump to a machine code routine at nnn
    pattern: 0x0000,
    mask: 0xf000,
    arguments: 'nnn',
    mnemonic: (nnn) => `SYS ${nnn}`,
    exec: (mem, _nnn) => mem,
  },
  {
    // Jump to location nnn
    pattern: 0x1000,
    mask: 0xf000,
    arguments: 'nnn',
    mnemonic: (nnn) => `JP ${nnn}`,
    exec: (mem, nnn) => {
      if (nnn < 0 || nnn >= SIZE) throw new Error('Memory out of bounds')
      return { ...mem, programCounter: nnn }
    },
  },
  {
    // Call subroutine at nnn
    pattern: 0x2000,
    mask: 0xf000,
    arguments: 'nnn',
    mnemonic: (nnn) => `CALL ${nnn}`,
    exec: (mem, nnn) => {
      if (nnn < 0 || nnn >= SIZE) throw new Error('Memory out of bounds')
      return {
        ...mem,
        stack: [mem.programCounter, ...mem.stack],
        programCounter: nnn,
      }
    },
  },
  {
    // Skip next instruction if Vx = kk
    pattern: 0x3000,
    mask: 0xf000,
    arguments: 'xkk',
    mnemonic: (x, kk) => `SE V${x}, ${kk}`,
    exec: (mem, x, kk) => {
      if (mem.registers[x] === kk)
        return { ...mem, programCounter: mem.programCounter + 4 }
      return mem
    },
  },
  {
    // Skip next instruction if Vx != kk
    pattern: 0x4000,
    mask: 0xf000,
    arguments: 'xkk',
    mnemonic: (x, kk) => `SNE V${x}, ${kk}`,
    exec: (mem, x, kk) => {
      if (mem.registers[x] !== kk)
        return { ...mem, programCounter: mem.programCounter + 4 }
      return mem
    },
  },
  {
    // Skip next instruction if Vx = Vy
    pattern: 0x5000,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `SE V${x}, V${y}`,
    exec: (mem, x, y) => {
      if (mem.registers[x] === mem.registers[y])
        return { ...mem, programCounter: mem.programCounter + 4 }
      return mem
    },
  },
  {
    pattern: 0x6000,
    mask: 0xf000,
    arguments: 'xkk',
    mnemonic: (x, kk) => `LD V${x}, ${kk}`,
    exec: (mem, x, kk) => mem,
  },
  {
    pattern: 0x7000,
    mask: 0xf000,
    arguments: 'xkk',
    mnemonic: (x, kk) => `ADD V${x}, ${kk}`,
    exec: (mem, x, kk) => mem,
  },
  {
    pattern: 0x8000,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `LD V${x}, V${y}`,
    exec: (mem, x, y) => mem,
  },
  {
    pattern: 0x8001,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `OR V${x}, V${y}`,
    exec: (mem, x, y) => mem,
  },
  {
    pattern: 0x8002,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `AND V${x}, V${y}`,
    exec: (mem, x, y) => mem,
  },
  {
    pattern: 0x8003,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `XOR V${x}, V${y}`,
    exec: (mem, x, y) => mem,
  },
  {
    pattern: 0x8004,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `ADD V${x}, V${y}`,
    exec: (mem, x, y) => mem,
  },
  {
    pattern: 0x8005,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `SUB V${x}, V${y}`,
    exec: (mem, x, y) => mem,
  },
  {
    pattern: 0x8006,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => (x === y ? `SHR V${x}` : `SHR V${x} V${y}`),
    exec: (mem, x, y) => mem,
  },
  {
    pattern: 0x8007,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `SUBN V${x}, V${y}`,
    exec: (mem, x, y) => mem,
  },
  {
    pattern: 0x800e,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => (x === y ? `SHL V${x}` : `SHL V${x}, V${y}`),
    exec: (mem, x, y) => mem,
  },
  {
    pattern: 0x9000,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `SNE V${x}, V${y}`,
    exec: (mem, x, y) => {
      if (mem.registers[x] !== mem.registers[y])
        return { ...mem, programCounter: mem.programCounter + 4 }
      return mem
    },
  },
  {
    pattern: 0xa000,
    mask: 0xf000,
    arguments: 'nnn',
    mnemonic: (nnn) => `LD I, ${nnn}`,
    exec: (mem, nnn) => mem,
  },
  {
    pattern: 0xb000,
    mask: 0xf000,
    arguments: 'nnn',
    mnemonic: (nnn) => `JP V0, ${nnn}`,
    exec: (mem, nnn) => mem,
  },
  {
    pattern: 0xc000,
    mask: 0xf000,
    arguments: 'xkk',
    mnemonic: (x, kk) => `RND V${x}, ${kk}`,
    exec: (mem, x, kk) => mem,
  },
  {
    pattern: 0xd000,
    mask: 0xf000,
    arguments: 'xyn',
    mnemonic: (x, y, n) => `DRW V${x}, V${y}, ${n}`,
    exec: (mem, x, y, n) => mem,
  },
  {
    pattern: 0xe09e,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `SKP V${x}`,
    exec: (mem, x) => mem,
  },
  {
    pattern: 0xe0a1,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `SKNP V${x}`,
    exec: (mem, x) => mem,
  },
  {
    pattern: 0xf007,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD V${x}, DT`,
    exec: (mem, x) => mem,
  },
  {
    pattern: 0xf00a,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD V${x}, K`,
    exec: (mem, x) => mem,
  },
  {
    pattern: 0xf015,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD DT, V${x}`,
    exec: (mem, x) => mem,
  },
  {
    pattern: 0xf018,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD ST, V${x}`,
    exec: (mem, x) => mem,
  },
  {
    pattern: 0xf01e,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `ADD I, V${x}`,
    exec: (mem, x) => mem,
  },
  {
    pattern: 0xf029,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD F, V${x}`,
    exec: (mem, x) => mem,
  },
  {
    pattern: 0xf033,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD B, V${x}`,
    exec: (mem, x) => mem,
  },
  {
    pattern: 0xf055,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD [I], V${x}`,
    exec: (mem, x) => mem,
  },
  {
    pattern: 0xf065,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD V${x}, [I]`,
    exec: (mem, x) => mem,
  },
]

const getInstruction = (opcode: number) => {
  const instruction = instructions.find((i) => (opcode & i.mask) === i.pattern)
  if (!instruction)
    throw new Error(`Unknown opcode ${opcode.toString(16).padStart(4, '0')}`)
  return instruction
}

const getArguments = (opcode: number, args?: string) => {
  if (!args) return []
  switch (args) {
    case 'nnn':
      return [opcode & 0x0fff]
    case 'x':
      return [(opcode & 0x0f00) >> 8]
    case 'xkk':
      return [(opcode & 0x0f00) >> 8, opcode & 0x00ff]
    case 'xy':
      return [(opcode & 0x0f00) >> 8, (opcode & 0x00f0) >> 4]
    case 'xyn':
      return [(opcode & 0x0f00) >> 8, (opcode & 0x00f0) >> 4, opcode & 0x000f]
  }
  throw new Error(`Unknown arguments: ${args}`)
}

export const getMnemonic = (opcode: number) => {
  const instruction = getInstruction(opcode)
  const args = getArguments(opcode, instruction.arguments).map((a) =>
    a.toString(16).toUpperCase()
  )
  return instruction.mnemonic(...args)
}

export const execute = (mem: Memory, opcode: number): Memory => {
  const instruction = getInstruction(opcode)
  const args = getArguments(opcode, instruction.arguments)
  const nextMem = instruction.exec(mem, ...args)
  return {
    ...nextMem,
    programCounter:
      mem.programCounter === nextMem.programCounter
        ? mem.programCounter + 2
        : nextMem.programCounter,
  }
}

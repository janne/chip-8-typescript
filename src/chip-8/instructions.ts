interface Opcode {
  pattern: number
  mask: number
  mnemonic: (...args: string[]) => string
  arguments?: string
}

const instructions: Array<Opcode> = [
  { pattern: 0x00e0, mask: 0xffff, mnemonic: () => 'CLS' },
  { pattern: 0x00ee, mask: 0xffff, mnemonic: () => 'RET' },
  {
    pattern: 0x0000,
    mask: 0xf000,
    mnemonic: (nnn) => `SYS ${nnn}`,
    arguments: 'nnn',
  },
  {
    pattern: 0x1000,
    mask: 0xf000,
    mnemonic: (nnn) => `JP ${nnn}`,
    arguments: 'nnn',
  },
  {
    pattern: 0x2000,
    mask: 0xf000,
    mnemonic: (nnn) => `CALL ${nnn}`,
    arguments: 'nnn',
  },
  {
    pattern: 0x3000,
    mask: 0xf000,
    mnemonic: (x, kk) => `SE V${x}, ${kk}`,
    arguments: 'xkk',
  },
  {
    pattern: 0x4000,
    mask: 0xf000,
    mnemonic: (x, kk) => `SNE V${x}, ${kk}`,
    arguments: 'xkk',
  },
  {
    pattern: 0x5000,
    mask: 0xf00f,
    mnemonic: (x, y) => `SE V${x}, V${y}`,
    arguments: 'xy',
  },
  {
    pattern: 0x6000,
    mask: 0xf000,
    mnemonic: (x, kk) => `LD V${x}, ${kk}`,
    arguments: 'xkk',
  },
  {
    pattern: 0x7000,
    mask: 0xf000,
    mnemonic: (x, kk) => `ADD V${x}, ${kk}`,
    arguments: 'xkk',
  },
  {
    pattern: 0x8000,
    mask: 0xf00f,
    mnemonic: (x, y) => `LD V${x}, V${y}`,
    arguments: 'xy',
  },
  {
    pattern: 0x8001,
    mask: 0xf00f,
    mnemonic: (x, y) => `OR V${x}, V${y}`,
    arguments: 'xy',
  },
  {
    pattern: 0x8002,
    mask: 0xf00f,
    mnemonic: (x, y) => `AND V${x}, V${y}`,
    arguments: 'xy',
  },
  {
    pattern: 0x8003,
    mask: 0xf00f,
    mnemonic: (x, y) => `XOR V${x}, V${y}`,
    arguments: 'xy',
  },
  {
    pattern: 0x8004,
    mask: 0xf00f,
    mnemonic: (x, y) => `ADD V${x}, V${y}`,
    arguments: 'xy',
  },
  {
    pattern: 0x8005,
    mask: 0xf00f,
    mnemonic: (x, y) => `SUB V${x}, V${y}`,
    arguments: 'xy',
  },
  {
    pattern: 0x8006,
    mask: 0xf00f,
    mnemonic: (x, y) => (x === y ? `SHR V${x}` : `SHR V${x} V${y}`),
    arguments: 'xy',
  },
  {
    pattern: 0x8007,
    mask: 0xf00f,
    mnemonic: (x, y) => `SUBN V${x}, V${y}`,
    arguments: 'xy',
  },
  {
    pattern: 0x800e,
    mask: 0xf00f,
    mnemonic: (x, y) => (x === y ? `SHL V${x}` : `SHL V${x}, V${y}`),
    arguments: 'xy',
  },
  {
    pattern: 0x9000,
    mask: 0xf00f,
    mnemonic: (x, y) => `SNE V${x}, V${y}`,
    arguments: 'xy',
  },
  {
    pattern: 0xa000,
    mask: 0xf000,
    mnemonic: (nnn) => `LD I, ${nnn}`,
    arguments: 'nnn',
  },
  {
    pattern: 0xb000,
    mask: 0xf000,
    mnemonic: (nnn) => `JP V0, ${nnn}`,
    arguments: 'nnn',
  },
  {
    pattern: 0xc000,
    mask: 0xf000,
    mnemonic: (x, kk) => `RND V${x}, ${kk}`,
    arguments: 'xkk',
  },
  {
    pattern: 0xd000,
    mask: 0xf000,
    mnemonic: (x, y, n) => `DRW V${x}, V${y}, ${n}`,
    arguments: 'xyn',
  },
  {
    pattern: 0xe09e,
    mask: 0xf0ff,
    mnemonic: (x) => `SKP V${x}`,
    arguments: 'x',
  },
  {
    pattern: 0xe0a1,
    mask: 0xf0ff,
    mnemonic: (x) => `SKNP V${x}`,
    arguments: 'x',
  },
  {
    pattern: 0xf007,
    mask: 0xf0ff,
    mnemonic: (x) => `LD V${x}, DT`,
    arguments: 'x',
  },
  {
    pattern: 0xf00a,
    mask: 0xf0ff,
    mnemonic: (x) => `LD V${x}, K`,
    arguments: 'x',
  },
  {
    pattern: 0xf015,
    mask: 0xf0ff,
    mnemonic: (x) => `LD DT, V${x}`,
    arguments: 'x',
  },
  {
    pattern: 0xf018,
    mask: 0xf0ff,
    mnemonic: (x) => `LD ST, V${x}`,
    arguments: 'x',
  },
  {
    pattern: 0xf01e,
    mask: 0xf0ff,
    mnemonic: (x) => `ADD I, V${x}`,
    arguments: 'x',
  },
  {
    pattern: 0xf029,
    mask: 0xf0ff,
    mnemonic: (x) => `LD F, V${x}`,
    arguments: 'x',
  },
  {
    pattern: 0xf033,
    mask: 0xf0ff,
    mnemonic: (x) => `LD B, V${x}`,
    arguments: 'x',
  },
  {
    pattern: 0xf055,
    mask: 0xf0ff,
    mnemonic: (x) => `LD [I], V${x}`,
    arguments: 'x',
  },
  {
    pattern: 0xf065,
    mask: 0xf0ff,
    mnemonic: (x) => `LD V${x}, [I]`,
    arguments: 'x',
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

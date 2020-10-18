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
      return {
        ...mem,
        stack: mem.stack.slice(1),
        programCounter: mem.stack[0] + 2,
      }
    },
  },
  {
    // Jump to a machine code routine at nnn
    pattern: 0x0000,
    mask: 0xf000,
    arguments: 'nnn',
    mnemonic: (nnn) => `SYS ${nnn}`,
    exec: (mem, _nnn) => {
      // NOP
      return mem
    },
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
    // Set Vx = kk
    pattern: 0x6000,
    mask: 0xf000,
    arguments: 'xkk',
    mnemonic: (x, kk) => `LD V${x}, ${kk}`,
    exec: (mem, x, kk) => {
      const registers = mem.registers.slice()
      registers[x] = kk
      return { ...mem, registers }
    },
  },
  {
    // Set Vx = Vx + kk // Set Vx = Vx + Vy, set VF = carry
    pattern: 0x7000,
    mask: 0xf000,
    arguments: 'xkk',
    mnemonic: (x, kk) => `ADD V${x}, ${kk}`,
    exec: (mem, x, kk) => {
      const registers = mem.registers.slice()
      registers[x] += kk
      return { ...mem, registers }
    },
  },
  {
    // Set Vx = Vy
    pattern: 0x8000,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `LD V${x}, V${y}`,
    exec: (mem, x, y) => {
      const registers = mem.registers.slice()
      registers[x] = registers[y]
      return { ...mem, registers }
    },
  },
  {
    // Set Vx = Vx OR Vy
    pattern: 0x8001,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `OR V${x}, V${y}`,
    exec: (mem, x, y) => {
      const registers = mem.registers.slice()
      registers[x] = registers[x] | registers[y]
      return { ...mem, registers }
    },
  },
  {
    // Set Vx = Vx AND Vy
    pattern: 0x8002,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `AND V${x}, V${y}`,
    exec: (mem, x, y) => {
      const registers = mem.registers.slice()
      registers[x] = registers[x] & registers[y]
      return { ...mem, registers }
    },
  },
  {
    // Set Vx = Vx XOR Vy
    pattern: 0x8003,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `XOR V${x}, V${y}`,
    exec: (mem, x, y) => {
      const registers = mem.registers.slice()
      registers[x] = registers[x] ^ registers[y]
      return { ...mem, registers }
    },
  },
  {
    // Set Vx = Vx + Vy, set VF = carry
    pattern: 0x8004,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `ADD V${x}, V${y}`,
    exec: (mem, x, y) => {
      const registers = mem.registers.slice()
      const sum = registers[x] + registers[y]
      registers[0xf] = sum > 255 ? 1 : 0
      registers[x] = sum % 0x100
      return { ...mem, registers }
    },
  },
  {
    // Set Vx = Vx - Vy, set VF = NOT borrow
    pattern: 0x8005,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `SUB V${x}, V${y}`,
    exec: (mem, x, y) => {
      const registers = mem.registers.slice()
      registers[0xf] = registers[x] > registers[y] ? 1 : 0
      registers[x] = registers[x] - registers[y]
      return { ...mem, registers }
    },
  },
  {
    // Set Vx = Vy >> 1
    pattern: 0x8006,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => (x === y ? `SHR V${x}` : `SHR V${x} V${y}`),
    exec: (mem, x, y) => {
      const registers = mem.registers.slice()
      registers[0xf] = registers[x] & 1
      registers[x] = registers[y] >> 1
      return { ...mem, registers }
    },
  },
  {
    // Set Vx = Vy - Vx, set VF = NOT borrow
    pattern: 0x8007,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => `SUBN V${x}, V${y}`,
    exec: (mem, x, y) => {
      const registers = mem.registers.slice()
      registers[x] = registers[y] - registers[x]
      registers[0xf] = registers[y] > registers[x] ? 1 : 0
      return { ...mem, registers }
    },
  },
  {
    // Set Vx = Vy << 1
    pattern: 0x800e,
    mask: 0xf00f,
    arguments: 'xy',
    mnemonic: (x, y) => (x === y ? `SHL V${x}` : `SHL V${x}, V${y}`),
    exec: (mem, x, y) => {
      const registers = mem.registers.slice()
      registers[0xf] = registers[x] & 0x80 ? 1 : 0
      registers[x] = registers[y] << 1
      return { ...mem, registers }
    },
  },
  {
    // Skip next instruction if Vx != Vy
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
    // Set I = nnn
    pattern: 0xa000,
    mask: 0xf000,
    arguments: 'nnn',
    mnemonic: (nnn) => `LD I, ${nnn}`,
    exec: (mem, nnn) => ({ ...mem, indexRegister: nnn }),
  },
  {
    // Jump to location nnn + V0
    pattern: 0xb000,
    mask: 0xf000,
    arguments: 'nnn',
    mnemonic: (nnn) => `JP V0, ${nnn}`,
    exec: (mem, nnn) => {
      const programCounter = mem.registers[0] + nnn
      if (programCounter < 0 || programCounter >= SIZE)
        throw new Error('Memory out of bounds')
      return { ...mem, programCounter }
    },
  },
  {
    // Set Vx = random byte AND kk
    pattern: 0xc000,
    mask: 0xf000,
    arguments: 'xkk',
    mnemonic: (x, kk) => `RND V${x}, ${kk}`,
    exec: (mem, x, kk) => {
      const registers = mem.registers.slice()
      registers[x] = Math.round(Math.random() * 255) & kk
      return { ...mem, registers }
    },
  },
  {
    // Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision
    pattern: 0xd000,
    mask: 0xf000,
    arguments: 'xyn',
    mnemonic: (x, y, n) => `DRW V${x}, V${y}, ${n}`,
    exec: (mem, x, y, n) => {
      const registers = mem.registers.slice()
      registers[0xf] = 0
      const display = mem.display.map((row) => row.slice())
      const xx = mem.registers[x]
      const yy = mem.registers[y]
      for (let line = 0; line < n; line++) {
        const pixels = mem.ram[mem.indexRegister + line]
          .toString(2)
          .padStart(8, '0')
          .split('')
          .map((s) => s === '1')
        pixels.forEach((v, i) => {
          if (v) {
            const dy = (yy + line) % 32
            const dx = (xx + i) % 64
            if (display[dy][dx]) {
              registers[0xf] = 1
              display[dy][dx] = false
            } else {
              display[dy][dx] = true
            }
          }
        })
      }
      return { ...mem, display, registers }
    },
  },
  {
    // Skip next instruction if key with the value of Vx is pressed
    pattern: 0xe09e,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `SKP V${x}`,
    exec: (mem, x) => {
      throw new Error('Not implemented yet')
    },
  },
  {
    // Skip next instruction if key with the value of Vx is not pressed
    pattern: 0xe0a1,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `SKNP V${x}`,
    exec: (mem, x) => {
      throw new Error('Not implemented yet')
    },
  },
  {
    // Set Vx = delay timer value
    pattern: 0xf007,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD V${x}, DT`,
    exec: (mem, x) => {
      const registers = mem.registers.slice()
      registers[x] = mem.delayTimer
      return { ...mem, registers }
    },
  },
  {
    // Wait for a key press, store the value of the key in Vx
    pattern: 0xf00a,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD V${x}, K`,
    exec: (mem, x) => {
      throw new Error('Not implemented yet')
    },
  },
  {
    // Set delay timer = Vx
    pattern: 0xf015,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD DT, V${x}`,
    exec: (mem, x) => ({ ...mem, delayTimer: mem.registers[x] }),
  },
  {
    // Set sound timer = Vx
    pattern: 0xf018,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD ST, V${x}`,
    exec: (mem, x) => ({ ...mem, soundTimer: mem.registers[x] }),
  },
  {
    // Set I = I + Vx
    pattern: 0xf01e,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `ADD I, V${x}`,
    exec: (mem, x) => ({
      ...mem,
      indexRegister: (mem.indexRegister + mem.registers[x]) % (SIZE - 1),
    }),
  },
  {
    // Set I = location of sprite for digit Vx
    pattern: 0xf029,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD F, V${x}`,
    exec: (mem, x) => {
      if (x < 0 || x > 15) throw new Error('Registers out of bounds')
      const digit = mem.registers[x]
      if (digit < 0 || digit > 15) throw new Error('Memory out of bounds')
      return { ...mem, indexRegister: digit * 5 }
    },
  },
  {
    // Store BCD representation of Vx in memory locations I, I+1, and I+2
    pattern: 0xf033,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD B, V${x}`,
    exec: (mem, x) => {
      const ram = mem.ram.slice()
      const v = mem.registers[x].toString(10)
      ram[mem.indexRegister] = parseInt(v[v.length - 3] || '0', 10)
      ram[mem.indexRegister + 1] = parseInt(v[v.length - 2] || '0', 10)
      ram[mem.indexRegister + 2] = parseInt(v[v.length - 1] || '0', 10)
      return { ...mem, ram }
    },
  },
  {
    // Store registers V0 through Vx in memory starting at location I
    pattern: 0xf055,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD [I], V${x}`,
    exec: (mem, x) => {
      if (x < 0 || x > 15) throw new Error('Registers out of bounds')
      if (mem.indexRegister + x > SIZE) throw new Error('Memory out of bounds')
      const ram = mem.ram.slice()
      mem.registers.slice(0, x).forEach((v, i) => {
        ram[mem.indexRegister + i] = v
      })
      return { ...mem, ram }
    },
  },
  {
    // Read registers V0 through Vx from memory starting at location I
    pattern: 0xf065,
    mask: 0xf0ff,
    arguments: 'x',
    mnemonic: (x) => `LD V${x}, [I]`,
    exec: (mem, x) => {
      const registers = mem.registers.slice()
      if (x < 0 || x > 15) throw new Error('Registers out of bounds')
      mem.ram
        .slice(mem.indexRegister, mem.indexRegister + x)
        .forEach((v, i) => {
          registers[i] = v
        })
      return { ...mem, registers }
    },
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

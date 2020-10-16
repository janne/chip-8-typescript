type RAM = Uint8Array

const SIZE = 0x1000

export const init = (): RAM => new Uint8Array(SIZE)

export const initWithData = (data: Uint8Array, to: number = 0x200): RAM => {
  if (data.length + to > SIZE) throw new Error('Data overflow')
  const ram = init()
  ram.set(data)
  return ram
}

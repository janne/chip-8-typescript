export const load = (url: string): Promise<Uint8Array> =>
  fetch(url)
    .then((resp) => resp.arrayBuffer())
    .then((buffer) => new Uint8Array(buffer))

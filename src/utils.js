/**
 * Returns an UID of Uppercase characters of a given length.
 * @param {Number} length length of the UID.
 */
export function makeId (length) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < length; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }
  return text
}

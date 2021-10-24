const { getShell } = require('@nexssp/os/legacy')

module.exports = (opts) => {
  const result = {}
  if (process.platform === 'win32') {
    Object.assign(result, { stdio: 'inherit' }, opts)
  } else {
    Object.assign(result, { stdio: 'inherit', shell: getShell() }, opts)
  }

  return result
}

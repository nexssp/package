const _log = require('@nexssp/logdebug')
const { bold } = require('@nexssp/ansi')
const { dirname, basename } = require('path')
const { nSpawn } = require('@nexssp/system')

const debug =
  (...args) =>
  (func = 'du') =>
    _log[func]('@package @files:', ...args)

const dm = (...args) => debug(...args)('dm')
const di = (...args) => debug(...args)('di')
const dg = (...args) => debug(...args)('dg')

const getFilesAsync = (sourceFolder, { glob = '_nexss.yml' } = {}) => {
  const fg = require('fast-glob')
  const p = `${sourceFolder}/**/${glob}`.replace(/\\/g, '/')
  dm('@fast-glob', p)
  return fg([p])
}

const operations = {
  INIT: 'init',
  UPDATE: 'update',
}

const nexssConfig = require('@nexssp/config')
const nexssCommand = require('@nexssp/command')

const file = (f, op) => {
  const dir = dirname(f)
  const file = basename(f) //_nexss.yml
  let operation, glob
  const config1 = nexssConfig({})
  const configContent = config1.load(f)

  if (!configContent || !configContent.commands) {
    _log.di(`No commands found in the config:`, f)
    return
  } else {
    _log.dg(`Commands found in the config`, f, `checking`, op)

    const config1 = nexssConfig({ configPath: f })
    const command1 = nexssCommand({ config: config1, quiet: true })

    const commandName = op
    const found = command1.existsInConfig(commandName)
    if (found) {
      command1.run(commandName, { cwd: dir })
    }
  }

  // switch (op) {
  //   case operations.INIT:
  //     glob = 'package.json'
  //     operation = 'npx @nexssp/command init'
  //     break
  //   case operations.UPDATE:
  //     glob = '_nexss.yml'
  //     operation = 'git pull --rebase origin master'
  //     break
  //   default:
  //     throw new Error('Operation not found: ', operation)
  // }

  return { operation, glob }
}

// Make operation on some packages
const doOpAsync = async (op, { packagesPath } = {}, package) => {
  if (package) {
    packagesPath += `/${package}`
  }

  const files = await getFilesAsync(packagesPath)

  di(`found: ${files.length} packages(s). `)
  dg(`starting..`)

  return files.map((f) => file(`${f}`, op))
}

// const file = (f, op) => {
//   const details = operationDetails(op)

//   dg({ op, details, file, dir })

//   // nSpawn(details.operation, { cwd: dir, stdio: 'inherit' })
// }

module.exports.doOpAsync = doOpAsync

// doOpAsync('init', { packagesPath: NEXSS_PACKAGES_PATH }, 'Id').catch((e) =>
//   console.error('ERRRORR!!', e)
// )

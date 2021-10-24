module.exports = (cmd, args) => {
  const { ensureInstalled } = require('@nexssp/ensure')

  // Make sure git is intalled
  ensureInstalled('git', {
    progress: process.argv.includes('--progress'),
  })

  const { NEXSS_PACKAGES_PATH } = require('../../../src/config/packages-config')

  args = args.filter((e) => e != '--debug')

  const { doOpAsync } = require('../../../lib/operations')

  const packageSelected = args.shift()
  doOpAsync('init', { packagesPath: NEXSS_PACKAGES_PATH }, packageSelected).catch((e) =>
    console.error('There was an error:', e)
  )
}

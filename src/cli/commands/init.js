module.exports = (cmd, args) => {
  const { ensureInstalled } = require('@nexssp/ensure')

  // Make sure git is intalled
  ensureInstalled('git', {
    progress: process.argv.includes('--progress'),
  })

  const { NEXSS_PACKAGES_PATH } = require('../../../src/config/packages-config')

  args = args.filter((e) => e != '--debug')

  const { doOp } = require('../../../lib/operations')

  const packageSelected = args.shift()
  doOp('init', { packagesPath: NEXSS_PACKAGES_PATH }, packageSelected)
}

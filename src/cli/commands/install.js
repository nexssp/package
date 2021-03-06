module.exports = (cmd, args) => {
  const { installPackages } = require('../../../lib/install')
  const { yellow, blue, green, bold } = require('@nexssp/ansi')

  const packageToInstall = args[0]

  if (!packageToInstall) {
    console.error(
      `Enter ${blue('Nexss Programmer')} ${yellow('package name')} or ${green(
        bold('all')
      )} for all of the packages.`
    )
  } else {
    const repos = require('../../config/nexssp-packages-repos.json')

    if (packageToInstall !== 'all') {
      if (!repos[`${packageToInstall}`]) {
        console.error(`Package ${yellow(bold(packageToInstall))} cannot be found.`)
      } else {
        installPackages(process.env.NEXSS_PACKAGES_PATH, packageToInstall, { repos })
      }
    } else {
      // Install all packages
      installPackages(process.env.NEXSS_PACKAGES_PATH)
    }
  }
}

module.exports = (cmd, args) => {
  const fs = require('fs')
  // const dirTree = require("directory-tree");
  const { config1 } = require('../../config/config')
  const NEXSS_PROJECT_CONFIG_PATH = process.env.NEXSS_PROJECT_CONFIG_PATH || config1.getPath()
  const { NEXSS_PACKAGES_PATH } = require('../../config/packages-config')

  const cliArgs = require('minimist')(args)

  const { saveNexss } = cliArgs
  const { copyPackage } = cliArgs
  const { forceNexss } = cliArgs
  delete cliArgs.saveNexss
  delete cliArgs.forceNexss
  delete cliArgs.copyPackage

  if (cliArgs._.length === 0) {
    log.error(
      'Enter package name `nexss pkg add myPackageName`. To see list of packages please use `nexss pkg l`'
    )
    process.exit()
  }

  const packageName = cliArgs._[0]

  if (!fs.existsSync(`${NEXSS_PACKAGES_PATH}/${packageName}`)) {
    log.error(`Package '${packageName}' does not exist.`)
    process.exit()
  }

  // without passing a name we use source name
  let destinationName = packageName
  if (cliArgs._.length > 1) {
    destinationName = cliArgs._[1]
  }

  if (fs.existsSync(destinationName) && !forceNexss) {
    log.error(
      'Destination folder exists. If you would like to  overwrite the folder please use --forceNexss option.'
    )
    process.exit(0)
  }

  delete cliArgs._

  let params = ''
  Object.keys(cliArgs).forEach((element) => {
    if (
      (cliArgs[element].indexOf && cliArgs[element].indexOf(' ') > -1) ||
      cliArgs[element] === '\n'
    ) {
      cliArgs[element] = `"${cliArgs[element]}"`
    }
    cliArgs[element] = `${cliArgs[element]}`
    params += ` --${element}=${cliArgs[element]}`
  })

  params = params.replace(/""/g, '"')

  if (copyPackage) {
    const fse = require('fs-extra')

    try {
      fse.ensureDirSync(destinationName)
      fse.copySync(`${NEXSS_PACKAGES_PATH}/${packageName}`, `${destinationName}`)
      log.success(
        `Package has been copied: '${NEXSS_PACKAGES_PATH}/${packageName}' to ${destinationName}`
      )
    } catch (er) {
      log.error(er)
      log.error('There was an error during copy/creation package.')
    }
  }

  if (saveNexss) {
    const configContent = config1.load(NEXSS_PROJECT_CONFIG_PATH)
    if (configContent) {
      const { push } = require('@nexssp/extend')
      push(configContent, 'files', { name: destinationName + params })
      config1.save(configContent, NEXSS_PROJECT_CONFIG_PATH)
      log.success('Configuration saved.')
    }
  } else {
    log.warn(
      'Package has been not added to _nexss.yml. Please add it manually or add it with --saveNexss option.'
    )
    if (!copyPackage) {
      log.warn(
        'Package has not been copied. Please use --copyPackage to save the package to your current Folder.'
      )
    }
    log.warn(`Please add this to the files as: ${destinationName + params}`)
  }
}

const os = require('os')
const homedir = os.homedir()
const NEXSS_PACKAGES_PATH = process.env.NEXSS_PACKAGES_PATH || `${homedir}/.nexss/packages`

module.exports = { NEXSS_PACKAGES_PATH }

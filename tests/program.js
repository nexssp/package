const nexssPackage = require('../src/package')

const { NEXSS_PACKAGES_PATH } = require('../src/config/packages-config')

const repos = require('./nexssp-packages-test.json')

const package1 = nexssPackage({ packagesPath: NEXSS_PACKAGES_PATH, repos })

const x = package1.install('Nexss')
console.log(x)

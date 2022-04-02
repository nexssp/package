const nexssPackage = require('../src/package')

const { NEXSS_PACKAGES_PATH } = require('../src/config/packages-config')

const repos = require('../src/config/nexssp-packages-repos.json')

const package1 = nexssPackage({ packagesPath: NEXSS_PACKAGES_PATH, repos })

const x1 = package1.install('Id')
console.log(x1)

const x2 = package1.install('Nexss')
console.log(x2)

const x3 = package1.install('Output')
console.log(x3)

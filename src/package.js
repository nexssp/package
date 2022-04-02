'use strict'
/* eslint-disable space-before-function-paren, comma-dangle */

/**
 * Copyright © 2018-2022 Nexss.com / Marcin Polak mapoart@gmail.com. All rights reserved.
 * This source code is governed by MIT license, please check LICENSE file.
 */

// Below is used in the configurations of the implemented languages
// We do that to not have them separate the same deps
// We will removed them in the later stages.
/**
 * Creates functionality for Nexss Languages.
 * @constructor
 * @param {string} cache
 * @param {string} progress - It will show progress of the installations eg. git
 */

function nexssPackage({ cache, progress, packagesPath, repos } = {}) {
  const { NEXSS_PACKAGES_PATH } = require('./config/packages-config')
  packagesPath = packagesPath || NEXSS_PACKAGES_PATH
  const _log = require('@nexssp/logdebug')
  if (!repos) {
    _log.info(new Error().stack)
    _log.error(`You need to specify repos field for nexssPackage. eg:`)
    _log.error(require('../tests/nexssp-packages-test.json'))
    process.exit(1)
  }
  let _paths = []
  let _fs
  let _path

  const _cache = cache
  const _progress = progress
  let _started

  const { bold, red, yellow, green } = require('@nexssp/ansi')

  const getPath = () => {
    return _path.normalize(packagesPath)
  }

  const { installPackages } = require('../lib/install')

  const start = () => {
    if (_started) {
      return _paths
    }
    _fs = require('fs')
    _path = require('path')

    // == We start a cache
    if (_cache) {
      _cache.start()
    }

    if (!_fs.existsSync(packagesPath)) {
      _fs.mkdirSync(packagesPath, { recursive: true })
    }

    _started = true

    return _paths
  }

  function isAvailable(name) {
    return repos[`${name}`]
  }

  function install(name) {
    _log.dy(`@package @install: is available '${name}'.`)
    if (isAvailable(name)) {
      if (!require('fs').existsSync(`${packagesPath}/${name}`)) {
        console.log(`Installing package ${bold(name)}..`)
        installPackages(packagesPath, name, { repos })
      } else {
        _log.dy(`@package @install: Folder '${packagesPath}/${name}' exists.`)
      }
      return `${packagesPath}/${name}`
    } else {
      _log.dy(`@package @install: ${name} does not exist in the repositories.`)
      // _log.di(repos)
    }
  }

  const o = {
    getPath,
    isAvailable,
    installPackages,
    install,
    start,
  }
  const { applyTracker } = require('@nexssp/logdebug/tracker')
  applyTracker(o, null)
  return o
}

module.exports = nexssPackage

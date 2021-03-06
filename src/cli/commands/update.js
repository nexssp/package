module.exports = (cmd, args) => {
  // TODO: To rewrite the whole function. Now works, but can be done much better.
  const { ensureInstalled } = require('@nexssp/ensure')
  const _log = require('@nexssp/logdebug')

  // Make sure git is intalled
  ensureInstalled('git', {
    progress: process.argv.includes('--progress'),
  })

  const fs = require('fs')
  const { bold, green } = require('@nexssp/ansi')
  const { error } = require('@nexssp/logdebug')
  // const dirTree = require("directory-tree");
  const { NEXSS_PACKAGES_PATH } = require('../../config/packages-config')

  const packagesPath = `${NEXSS_PACKAGES_PATH}`
  if (!fs.existsSync(packagesPath)) {
    console.log(`Packages path ${bold(packagesPath)} does not exist. Installing..`)
    require('../lib/install').installPackages(NEXSS_PACKAGES_PATH)
  }
  const spawnOptions = require('../../config/spawnOptions')

  const authors = fs.readdirSync(packagesPath)

  let pkgs = []
  // TODO: To fix below syntac - make more efficient! works for now
  // TODO: Make it DRY LATER - this is done jst to get it to work
  process.chdir(packagesPath)

  // Remove @dev from updates.
  const { remove } = require('@nexssp/extend/array')

  remove(authors, '@dev')

  function upp(cwd) {
    _log.info(`CWD:. ${cwd}`)
    try {
      require('child_process').execSync(
        `git pull --rebase origin master`,
        spawnOptions({
          cwd,
          stdio: 'inherit',
        })
      )
      _log.success(`Package update checked. ${cwd}`)
    } catch (er) {
      // console.log(er)
      error(bold(er.message))
      console.error(bold(`${cwd} not a git repo?`))
    }
  }

  authors.forEach((author) => {
    if (author !== '3rdPartyLibraries' && fs.statSync(`${packagesPath}/${author}`).isDirectory()) {
      if (author.indexOf('@') === 0) {
        fs.readdirSync(`${packagesPath}/${author}`).map((pkg) => {
          if (!fs.existsSync(`${packagesPath}/${author}/${pkg}/_nexss.yml`)) {
            if (fs.statSync(`${packagesPath}/${author}/${pkg}`).isDirectory()) {
              fs.readdirSync(`${packagesPath}/${author}/${pkg}`).map((details) => {
                if (fs.statSync(`${packagesPath}/${author}/${pkg}/.git`).isDirectory()) {
                  console.log(`${bold(green('Update package'))}: ${packagesPath}/${author}/${pkg}`)
                  upp(`${packagesPath}/${author}/${pkg}/${details}`)
                }
              })
            } else {
              pkgs.push({
                type: 'file',
                path: `${packagesPath}/${author}/${pkg}`,
              })
            }
          } else {
            // 3rdPartyLibraries is a directory where nexss install additional libs.

            if (pkg !== '3rdPartyLibraries') {
              console.log(`${bold(green('Update package'))}: ${author}/${pkg}`)

              upp(`${packagesPath}/${author}/${pkg}`)
            }
          }
        })
      } else {
        if (fs.existsSync(`${packagesPath}/${author}/_nexss.yml`)) {
          if (author !== '3rdPartyLibraries') {
            upp(`${packagesPath}/${author}`)
          }
        }
        fs.readdirSync(`${packagesPath}/${author}`).map((pkg) => {
          // 3rdPartyLibraries is a directory where nexss install additional libs.
          if (fs.statSync(`${packagesPath}/${author}/${pkg}`).isDirectory()) {
            // console.log(`${packagesPath}/${author}/${pkg}/_nexss.yml`);
            if (fs.existsSync(`${packagesPath}/${author}/${pkg}/_nexss.yml`)) {
              if (pkg !== '3rdPartyLibraries') {
                upp(`${packagesPath}/${author}/${pkg}`)
              }
            }
          }
        })
      }
    }
  })

  if (pkgs.length > 0) {
    if (cliArgs._.slice(2).length > 0) {
      const options = {
        // pre: "<",
        // post: ">",
        extract(el) {
          return `${el.path} ${el.type}`
        },
      }
      const fuzzy = require('fuzzy')
      const fuzzyResult = fuzzy.filter(cliArgs._.slice(2).join(' '), pkgs, options)
      pkgs = fuzzyResult.map((el) => el.original)
      // const pkgs = new FuzzySearch(pkgs, ["type", "path"], {
      //   caseSensitive: false
      // });
    }

    if (cliArgs.json) {
      console.log(JSON.stringify(pkgs.flat()))
    } else {
      pkgs.forEach((e) => {
        console.log(e)
      })
    }
  }

  console.log('done.')

  // packages = packages || [];
  // packages.forEach(function(file) {
  //   if (fs.statSync(dir + file).isDirectory()) {
  //     filelist = walkSync(dir + file + "/", filelist);
  //   } else {
  //     filelist.push(file);
  //   }
  // });
}

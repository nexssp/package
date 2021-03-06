module.exports = (cmd, args) => {
  const fs = require('fs')
  // const dirTree = require("directory-tree");
  const { NEXSS_PACKAGES_PATH } = require('../../config/packages-config')

  const packagesPath = `${NEXSS_PACKAGES_PATH}`

  const authors = fs.readdirSync(packagesPath)

  let pkgs = []
  // TODO: To fix below syntac - make more efficient! works for now
  authors.forEach((author) => {
    if (author !== '3rdPartyLibraries' && fs.statSync(`${packagesPath}/${author}`).isDirectory()) {
      if (author.indexOf('@') === 0) {
        fs.readdirSync(`${packagesPath}/${author}`).map((pkg) => {
          if (!fs.existsSync(`${packagesPath}/${author}/${pkg}/_nexss.yml`)) {
            if (fs.statSync(`${packagesPath}/${author}/${pkg}`).isDirectory()) {
              fs.readdirSync(`${packagesPath}/${author}/${pkg}`).map((details) => {
                pkgs.push({ type: 'pkg', path: `${author}/${pkg}/${details}` })
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
              pkgs.push({
                type: 'pkg',
                path: `${author}/${pkg}`,
              })
            }
          }
        })
      } else {
        if (fs.existsSync(`${packagesPath}/${author}/_nexss.yml`)) {
          if (author !== '3rdPartyLibraries') {
            pkgs.push({
              type: 'pkg',
              path: `${author}`,
            })
          }
        }
        fs.readdirSync(`${packagesPath}/${author}`).map((pkg) => {
          if (fs.statSync(`${packagesPath}/${author}/${pkg}`).isDirectory()) {
            // console.log(`${packagesPath}/${author}/${pkg}/_nexss.yml`);
            if (fs.existsSync(`${packagesPath}/${author}/${pkg}/_nexss.yml`)) {
              if (pkg !== '3rdPartyLibraries') {
                pkgs.push({
                  type: 'pkg',
                  path: `${author}/${pkg}`,
                })
              }
            }
          }
        })
      }
    }
  })

  const json = args.includes('--json')
  const { remove } = require('@nexssp/extend/array')
  args = remove(args, '--json')

  if (pkgs.length > 0) {
    if (args.length > 0) {
      const options = {
        // pre: "<",
        // post: ">",
        extract(el) {
          return `${el.path} ${el.type}`
        },
      }
      const fuzzy = require('fuzzy')
      const fuzzyResult = fuzzy.filter(args.join(' '), pkgs, options)
      pkgs = fuzzyResult.map((el) => el.original)
      // const pkgs = new FuzzySearch(pkgs, ["type", "path"], {
      //   caseSensitive: false
      // });
    }

    if (json) {
      console.log(JSON.stringify(pkgs.flat()))
    } else {
      pkgs.forEach((e) => {
        console.log(e)
      })
    }
  } else {
    console.warn(`No packages found at ${NEXSS_PACKAGES_PATH}`)
  }
}

// packages = packages || [];
// packages.forEach(function(file) {
//   if (fs.statSync(dir + file).isDirectory()) {
//     filelist = walkSync(dir + file + "/", filelist);
//   } else {
//     filelist.push(file);
//   }
// });

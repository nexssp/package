// This file routes the dynamic path
// for example plugin dyn command b c where dyn is dynamic
// btw we already checked if the command exists

module.exports = (cmd, args, languageExtension, { through }) => {
  const _debug = args.includes('--debug')
  args = args.filter((a) => a !== '--debug')
  const _log = require('@nexssp/logdebug')
  _log.dm('@languages @router cmd, args: ', { cmd, args, languageExtension })
  let aliases = {}
  try {
    aliases = require('../../aliases.json')

    _log.dm('@languages @router finding alias ', cmd, aliases[cmd])
    if (aliases[cmd]) {
      cmd = aliases[cmd]
      _log.dg('@languages @router new alias', cmd)
    }
  } catch (e) {}
  // We check if language is by extension
  const { language1 } = require('./config/language')
  // isImplementedExtension contains . as
  const isImplementedExtension = language1.isImplementedByExtension(languageExtension)

  _log.dg(
    `@languages @router checking if language ${languageExtension} is implemented`,
    isImplementedExtension
  )
  if (isImplementedExtension) {
    language1.start()
    console.log('====================================================================')
    const selectedLanguage = language1.byExtension(isImplementedExtension)
    _log.dg(`@languages @router selected language: `, isImplementedExtension)
    if (selectedLanguage) {
      cmd = args[0]
      args = args.slice(1)
      const commandPath = `${__dirname}/default/commands/${cmd}.js`
      try {
        const command = require(commandPath)
        // As the 4th argument we pass loaded language
        return command(cmd, args, languageExtension, selectedLanguage)
      } catch (e) {
        // console.log(e)
        if (!through) {
          console.error(`Command ${cmd} not found.`)
        }
      }
    } else {
      _log.dr(`@languages @router error getting data about language: `, isImplementedExtension)
    }
  } else {
    // As the 4th argument we pass loaded language
    _log.dr(`@languages @router ??? trying to run command ????`, isImplementedExtension)
    try {
      const commandPath = `${__dirname}/commands/${cmd}.js`
      _log.dr(`Trying to run command: `, commandPath)
      const command = require(commandPath)
      return command(cmd, args, languageExtension)
    } catch (e) {
      // console.log(e)
      if (!through) {
        console.log(`Command ${cmd} not found.`)
      }
    }
  }
}

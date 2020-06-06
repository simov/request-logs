
var c = require('colors/safe')
var j = require('prettyjson')

var debug
module.exports = (_debug) => {
  debug = _debug
  if (debug.nocolor) {
    c.enabled = false
  }
  return {header, method, status, url, content}
}


var header = (name) =>
  /req/.test(name) ? c.cyan.inverse(name) :
  /res/.test(name) ? c.yellow.inverse(name) :
  /json|body|form/.test(name) ? c.white.inverse(name) :
  null


var method = (verb) =>
  /GET/.test(verb) ? c.green(verb) :
  /POST|PUT/.test(verb) ? c.cyan(verb) :
  /DELETE/.test(verb) ? c.red(verb) :
  /HEAD|OPTIONS|CONNECT/.test(verb) ? c.yellow(verb) :
  /TRACE/.test(verb) ? c.gray(verb) :
  null


var status = (code, message) =>
  /^1/.test(code) ? c.white(`${code} ${message}`) :
  /^2/.test(code) ? c.green(`${code} ${message}`) :
  /^3/.test(code) ? c.yellow(`${code} ${message}`) :
  /^4/.test(code) ? c.red(`${code} ${message}`) :
  /^5/.test(code) ? c.red.bold(`${code} ${message}`) :
  null


var url = ({protocol, hostname, port, path}) => c.white.inverse([
  `${protocol}//`,
  hostname,
  port ? `:${port}` : '',
  path || '/',
].join(''))


var content = (json) =>
  j.render(
    json,
    debug.nocolor ? {noColor: true} :
    {
      keysColor: 'brightBlue', stringColor: 'white', numberColor: 'cyan',
      dashColor: 'white', inlineArrays: true
    },
    4
  )

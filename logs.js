
var qs = require('querystring')
var c = require('colors/safe')
var j = require('prettyjson')


var keys = ['req', 'res', 'body', 'json', 'nocolor', 'bright']

var debug = process.env.DEBUG.split(',')
  .filter((key) => keys.includes(key))
  .reduce((debug, key) => (debug[key] = true, debug), {})

var b = debug.bright


var header = (name) =>
  /req/.test(name) ? (b?c.brightCyan:c.cyan).inverse(name) :
  /res/.test(name) ? (b?c.brightYellow:c.yellow).inverse(name) :
  /json|body|form/.test(name) ? (b?c.white:c.gray).inverse(name) :
  null


var method = (verb) =>
  /GET/.test(verb) ? (b?c.brightGreen:c.green)(verb) :
  /POST|PUT/.test(verb) ? (b?c.brightBlue:c.cyan)(verb) :
  /DELETE/.test(verb) ? (b?c.brightRed:c.red)(verb) :
  /HEAD|OPTIONS|CONNECT/.test(verb) ? (b?c.brightYellow:c.yellow)(verb) :
  /TRACE/.test(verb) ? (b?c.white:c.gray)(verb) :
  null


var status = (code, message) =>
  /^1/.test(code) ? (b?c.brightWhite:c.white)(`${code} ${message}`) :
  /^2/.test(code) ? (b?c.brightGreen:c.green)(`${code} ${message}`) :
  /^3/.test(code) ? (b?c.brightYellow:c.yellow)(`${code} ${message}`) :
  /^4/.test(code) ? (b?c.brightRed:c.red)(`${code} ${message}`) :
  /^5/.test(code) ? (b?c.brightRed:c.red).bold(`${code} ${message}`) :
  null


var url = ({protocol, hostname, port, path}) => (b?c.brightCyan:c.yellow)([
  `${protocol}//`,
  hostname,
  port ? `:${port}` : '',
  path || '/',
].join(''))


var content = (json) =>
  j.render(
    json,
    debug.nocolor ? {noColor: true} :
    debug.bright
      ? {keysColor: 'brightYellow', stringColor: 'brightGreen',
          numberColor: 'brightBlue', dashColor: 'brightWhite'}
      : {keysColor: 'blue', stringColor: 'grey'},
    4
  )


var request = ({req, body, options}) => {
  // req method url
  console.log(
    header('req'),
    method(options.method),
    url(options),
  )
  // headers
  console.log(content(
    Object.keys(req._headerNames).reduce((headers, key) => (
      headers[req._headerNames[key]] = req._headers[key],
      headers
    ), {})
  ))
  // body
  if (debug.body && body) {
    console.log(header('body'))
    console.log(body)
  }
  // json or querystring
  if (debug.json && body) {
    var name = Object.keys(options.headers)
      .find((name) => name.toLowerCase() === 'content-type')
    if (/application\/json/.test(options.headers[name])) {
      console.log(header('json'))
      console.log(content(JSON.parse(body)))
    }
    else if (/application\/x-www-form-urlencoded/.test(options.headers[header])) {
      console.log(header('form'))
      console.log(content(qs.parse(body)))
    }
  }
}


var response = ({res, body, json}) => {
  if (res) {
    // res status message
    console.log(
      header('res'),
      status(res.statusCode, res.statusMessage)
    )
    // headers
    console.log(
      content(res.headers)
    )
  }
  // body
  if (body) {
    console.log(header('body'))
    console.log(body)
  }
  // json
  if (json) {
    console.log(header('json'))
    console.log(content(json))
  }
}


module.exports = ({req, res, options, body, json}) => {

  if (!Object.keys(debug).length) {
    return
  }
  if (debug.nocolor) {
    c.enabled = false
  }

  if (debug.req && req) {
    request({req, body, options})
  }

  if (debug.res && res) {
    response({res})
  }

  else if (debug.res && !res && !req) {
    if (debug.body && body) {
      response({body})
    }
    if (debug.json && json) {
      response({json})
    }
  }

}


var qs = require('querystring')
var c = require('colors/safe')
var j = require('prettyjson')


// req, res, body, json
var debug = process.env.DEBUG.split(',')
  .reduce((debug, key) => (debug[key] = true, debug), {})


var header = (name) =>
  /req/.test(name) ? c.cyan.inverse(name) :
  /res/.test(name) ? c.yellow.inverse(name) :
  /json|body|form/.test(name) ? c.gray.inverse(name) :
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


var url = ({protocol, hostname, port, path}) => c.yellow([
  `${protocol}//`,
  hostname,
  port ? `:${port}` : '',
  path || '/',
].join(''))


var prettyjson = (json) =>
  j.render(
    json,
    debug.nocolor ? {noColor: true} : {keysColor: 'blue', stringColor: 'grey'},
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
  console.log(prettyjson(
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
      console.log(prettyjson(JSON.parse(body)))
    }
    else if (/application\/x-www-form-urlencoded/.test(options.headers[header])) {
      console.log(header('form'))
      console.log(prettyjson(qs.parse(body)))
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
      prettyjson(res.headers)
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
    console.log(prettyjson(json))
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

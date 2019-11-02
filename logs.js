
var qs = require('querystring')
var c = require('colors/safe')
var j = require('prettyjson')


// req, res, body, json
var debug = process.env.DEBUG.split(',')
  .reduce((debug, key) => (debug[key] = true, debug), {})


var method = (verb) =>
  /GET/.test(verb) ? c.green :
  /POST|PUT/.test(verb) ? c.cyan :
  /DELETE/.test(verb) ? c.red :
  /HEAD|OPTIONS|CONNECT/.test(verb) ? c.yellow :
  /TRACE/.test(verb) ? c.gray :
  c.gray


var uri = ({protocol, hostname, port, path}) => [
  `${protocol}//`,
  hostname,
  port ? `:${port}` : '',
  path || '/',
].join('')


var status = (code) =>
  /^1/.test(code) ? c.white :
  /^2/.test(code) ? c.green :
  /^3/.test(code) ? c.yellow :
  /^4/.test(code) ? c.red :
  /^5/.test(code) ? c.red.bold :
  c.white


var prettyjson = (obj) =>
  j.render(
    obj,
    debug.nocolor ? {noColor: true} : {keysColor: 'blue', stringColor: 'grey'},
    4
  )


var request = ({req, body, options}) => {
  // req method url
  console.log(
    c.cyan.inverse('req'),
    method(options.method)(options.method),
    c.yellow(uri(options)),
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
    console.log(c.gray.inverse('body'))
    console.log(body)
  }
  // json or querystring
  if (debug.json && body) {
    var header = Object.keys(options.headers)
      .find((name) => name.toLowerCase() === 'content-type')
    if (/application\/json/.test(options.headers[header])) {
      console.log(c.gray.inverse('json'))
      console.log(prettyjson(JSON.parse(body)))
    }
    else if (/application\/x-www-form-urlencoded/.test(options.headers[header])) {
      console.log(c.gray.inverse('form'))
      console.log(prettyjson(qs.parse(body)))
    }
  }
}


var response = ({res, body, json}) => {
  if (res) {
    // res status message
    console.log(
      c.yellow.inverse('res'),
      status(res.statusCode)(res.statusCode + ' ' + res.statusMessage)
    )
    // headers
    console.log(
      prettyjson(res.headers)
    )
  }
  // body
  if (body) {
    console.log(c.gray.inverse('body'))
    console.log(body)
  }
  // json
  if (json) {
    console.log(c.gray.inverse('json'))
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


var qs = require('querystring')

var debug, header, method, status, url, content
module.exports = (_debug) => {
  debug = _debug
  ;({header, method, status, url, content} = require('./console')(debug))
  return {request, response}
}


var request = {
  send: ({req, body, options}) => {
    // req method url
    if (debug.req && req) {
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
    }
    // body
    if (debug.req && debug.body && body) {
      console.log(header('body'))
      if (body.constructor.name === 'MultiStream') {
        body._raw.forEach((part) => { // multipart
          console.log(typeof part === 'object' ?
              part.path ? `file stream: ${part.path}` :
              part.hasOwnProperty('httpVersion') ? [
                'http stream:',
                part.headers['content-type'],
                part.headers['content-length'],
              ].filter(Boolean).join(' ') :
              part :
            part
          )
        })
      }
      else {
        console.log(body)
      }
    }
    // json or querystring
    if (debug.req && debug.json && body) {
      var name = Object.keys(options.headers)
        .find((name) => name.toLowerCase() === 'content-type')
      if (/json|javascript/.test(options.headers[name])) {
        console.log(header('json'))
        console.log(content(JSON.parse(body)))
      }
      else if (/application\/x-www-form-urlencoded/.test(options.headers[name])) {
        console.log(header('form'))
        console.log(content(qs.parse(body)))
      }
    }
  }
}

var response = {
  send: ({res}) => {
    // res status message
    if (debug.res && res) {
      console.log(
        header('res'),
        status(res.statusCode, res.statusMessage)
      )
      // headers
      console.log(
        content(res.headers)
      )
    }
  },
  string: ({body}) => {
    // body
    if (debug.res && debug.body && body) {
      console.log(header('body'))
      console.log(body)
    }
  },
  parse: ({res, body}) => {
    // json or querystring
    if (debug.res && debug.json && body) {
      var name = Object.keys(res.headers)
        .find((name) => name.toLowerCase() === 'content-type')
      var type =
        /json|javascript/.test(res.headers[name]) ? 'json' :
        /application\/x-www-form-urlencoded/.test(res.headers[name]) ? 'form' :
        null
      if (type) {
        console.log(header(type))
        console.log(content(body))
      }
    }
  },
  status: ({res, body, raw}) => {
    response.send({res})
    response.string({body: raw})
    response.parse({res, body})
  }
}

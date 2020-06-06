
var keys = ['req', 'res', 'body', 'json', 'nocolor', 'sync']

var debug = (process.env.DEBUG || '').split(',')
  .filter(Boolean)
  .map((key) => key.trim())
  .filter((key) => keys.includes(key))
  .reduce((debug, key) => (debug[key] = true, debug), {})

var handler = require('./lib/handler')
if (typeof handler === 'function') {
  var {request, response} = handler(debug)
}

var sync = {}


module.exports = (args) => {

  if (!Object.keys(debug).length) {
    return
  }

  if (debug.sync) {
    if (args.send && args.send.req) {
      var id = args.send.req.id
      sync[id] = args.send
    }
    else if (args.status) {
      var id = args.status.res.id
      request.send(sync[id])
      response.status(args.status)
      delete sync[id]
    }
  }
  else {
    if (!args.status) {
      var mw = Object.keys(args)[0]
      request[mw] && request[mw](args[mw])
      response[mw] && response[mw](args[mw])
    }
  }

}


module.exports = (function () {
  return process.env.SOURCE
    ? require('./logs')
    : require('./build/logs')
})()

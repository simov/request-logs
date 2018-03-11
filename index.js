
module.exports = (() =>
  parseInt(process.version.replace('v', '').split('.')[0]) >= 8
    ? require('../logs')
    : require('./logs')
)()

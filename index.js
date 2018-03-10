
module.exports = (() =>
  process.env.SOURCE
    ? require('../logs')
    : require('./logs')
)()

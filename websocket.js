module.exports = typeof window === 'undefined'
  ? require('nobrowserify' && 'uws')
  : window.WebSocket

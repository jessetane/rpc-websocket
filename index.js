module.exports = RPCWebSocket

var RPCEngine = require('rpc-engine')
var inherits = require('inherits')
var ws = require('ws') || window.WebSocket

inherits(RPCWebSocket, RPCEngine)

function RPCWebSocket (opts) {
  RPCEngine.call(this)
  opts = opts || {}
  for (var key in opts) {
    this[key] = opts[key]
  }
  this.pingInterval = this.pingInterval || 55000
  this.reconnectInterval = this.reconnectInterval || 7500
  this._onclose = this._onclose.bind(this)
  this._onopen = this._onopen.bind(this)
  this.connect = this.connect.bind(this)
}

RPCWebSocket.prototype.connect = function () {
  this.socket = new WebSocket(this.url)
  this.socket.addEventListener('close', this._onclose)
  this.socket.addEventListener('error', this._onclose)
  this.socket.addEventListener('open', this._onopen)
}

RPCWebSocket.prototype._onopen = function () {
  clearInterval(this._reconnectInterval)
  this._pingInterval = setInterval(() => {
    this.call('ping')
  }, this.pingInterval)
  this.socket.addEventListener('message', evt => {
    this.onmessage(evt.data)
  })
  if (this.onopen) {
    this.onopen()
  }
}

RPCWebSocket.prototype._onclose = function () {
  this.socket.removeEventListener('close', this._onclose)
  this.socket.removeEventListener('error', this._onclose)
  clearInterval(this._pingInterval)
  this._reconnectInterval = setTimeout(
    this.connect,
    this.reconnectInterval
  )
  if (this.onclose) {
    this.onclose()
  }
}

RPCWebSocket.prototype.send = function (message) {
  this.socket.send(message)
}

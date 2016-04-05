module.exports = WebSocketRPC

var isBrowser = typeof window !== 'undefined'

var RPCEngine = require('rpc-engine')
var inherits = require('inherits')
var WebSocket = isBrowser ? window.WebSocket : require('ws')

inherits(WebSocketRPC, RPCEngine)

function WebSocketRPC (opts) {
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

WebSocketRPC.prototype.connect = function () {
  this.socket = new WebSocket(this.url)
  this.socket.onclose = this._onclose
  this.socket.onerror = this._onclose
  this.socket.onopen = this._onopen
}

WebSocketRPC.prototype._onopen = function () {
  clearInterval(this._reconnectInterval)
  this._pingInterval = setInterval(function () {
    this.call('ping')
  }.bind(this), this.pingInterval)
  this.socket.onmessage = function (evt) {
    this.onmessage(evt.data)
  }.bind(this)
  if (this.onopen) {
    this.onopen()
  }
}

WebSocketRPC.prototype._onclose = function () {
  delete this.socket.onclose
  delete this.socket.onerror
  clearInterval(this._pingInterval)
  this._reconnectInterval = setTimeout(
    this.connect,
    this.reconnectInterval
  )
  if (this.onclose) {
    this.onclose()
  }
}

WebSocketRPC.prototype.send = function (message) {
  this.socket.send(message)
}

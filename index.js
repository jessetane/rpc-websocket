module.exports = WebSocketRPC

var RPCEngine = require('rpc-engine')
var inherits = require('inherits')
var ws = require('ws') || window.WebSocket

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
  this.socket.addEventListener('close', this._onclose)
  this.socket.addEventListener('error', this._onclose)
  this.socket.addEventListener('open', this._onopen)
}

WebSocketRPC.prototype._onopen = function () {
  clearInterval(this._reconnectInterval)
  this._pingInterval = setInterval(function () {
    this.call('ping')
  }.bind(this), this.pingInterval)
  this.socket.addEventListener('message', function (evt) {
    this.onmessage(evt.data)
  }.bind(this))
  if (this.onopen) {
    this.onopen()
  }
}

WebSocketRPC.prototype._onclose = function () {
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

WebSocketRPC.prototype.send = function (message) {
  this.socket.send(message)
}

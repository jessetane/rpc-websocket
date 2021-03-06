module.exports = WebSocketRPC

var RPCEngine = require('rpc-engine')
var inherits = require('inherits')
var WebSocket = require('./websocket')

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

Object.defineProperty(WebSocketRPC.prototype, 'connected', {
  get: function () {
    return this._pingInterval !== undefined
  }
})

WebSocketRPC.prototype.connect = function () {
  if (!this.url && isBrowser) {
    var protocol = location.protocol === 'https:' ? 'wss' : 'ws'
    this.url = protocol + '://' + location.host
  }
  this.socket = new WebSocket(this.url)
  this.socket.onclose = this._onclose
  this.socket.onerror = this._onclose
  this.socket.onopen = this._onopen
}

WebSocketRPC.prototype.disconnect = function () {
  this.socket.close()
  clearTimeout(this._reconnectInterval)
}

WebSocketRPC.prototype._onopen = function () {
  clearInterval(this._reconnectInterval)
  this._pingInterval = setInterval(function () {
    this.call('ping')
  }.bind(this), this.pingInterval)
  this.socket.onmessage = function (evt) {
    this.receive(evt.data)
  }.bind(this)
  this.emit('open')
}

WebSocketRPC.prototype._onclose = function (err) {
  this.close()
  this.socket.onclose = this.socket.onerror = null
  clearInterval(this._pingInterval)
  delete this._pingInterval
  this._reconnectInterval = setTimeout(
    this.connect,
    this.reconnectInterval
  )
  if (err) {
    this.emit('error', err)
  }
  this.emit('close')
}

WebSocketRPC.prototype.send = function (message) {
  this.socket.send(message)
}

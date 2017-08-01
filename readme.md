# websocket-rpc
[rpc-engine](https://github.com/jessetane/rpc-engine) with a websocket transport.

## Why
Personal flavor of reconnect and keepalive logic.

## How
``` javascript
var WebSocketRPC = require('websocket-rpc')

var remote = new WebSocketRPC({
  url: 'wss://www.example.com',
  serialize: JSON.stringify,
  deserialize: JSON.parse
})

remote.on('open', function () {
  console.log('socket open')
})

remote.connect()
```

## License
MIT

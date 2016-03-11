# rpc-websocket
[rpc-engine](https://github.com/jessetane/rpc-engine) with a websocket transport.

## Why
Personal flavor of reconnect and keepalive logic.

## How
``` javascript
import RPCWebSocket from 'rpc-websocket'

var remote = new RPCWebSocket({
  url: 'wss://www.example.com',
  serialize: JSON.stringify,
  deserialize: JSON.parse
})

remote.onopen = function () {
  console.log('socket open')
}

remote.connect()
```

## License
Public domain

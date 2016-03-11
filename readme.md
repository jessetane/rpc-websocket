# rpc-websocket
[rpc-engine](https://github.com/jessetane/rpc-engine) with a websocket transport.

## Why
Personal flavor of reconnect and keepalive logic.

## How
``` javascript
import WebSocketRPC from 'websocket-rpc'

var remote = new WebSocketRPC({
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

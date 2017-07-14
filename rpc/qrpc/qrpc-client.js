const qrpc = require('qrpc')

const bench = require('fastbench')

const client = qrpc.connect(1337, 'localhost', function() {

  function call (cb) {
    client.call('echo', {a: 1, b: 'test'}, function(err, ret) {
      // client callback is invoked on every response message
      // console.log("reply from server:", ret)
      cb()
      // => reply from server: 'test ran!'
      // => reply from server: { a: 1, b: 'test' }
    })
  }

  bench([call], 50000)()

  // client.call('echo', new Buffer("test"), function(err, ret) {
  //   console.log("reply from server:", ret)
  //   // => reply from server: 'test ran!'
  //   // => reply from server: <Buffer 74 65 73 74>
  // })
})
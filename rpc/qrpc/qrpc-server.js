const qrpc = require('qrpc')
const server = qrpc.createServer()

server.addHandler('echo', function(req, res, next) {
  let err = null
  res.write('test ran!')
  // next(err, req.m)
})

server.listen(1337, function() {
  console.log("qrpc listening on port 1337")
})
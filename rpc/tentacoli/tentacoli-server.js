'use strict'

const tentacoli = require('tentacoli')
const net = require('net')
const from = require('from2')
const through = require('through2')
const pump = require('pump')

const server = net.createServer(function (original) {
  const stream = tentacoli()
  pump(stream, original, stream)

  stream.on('request', handle)
})

function handle (req, reply) {
  console.log('--> serving request ', req.cmd)
  reply(null, {
    data: 'some data',
    streams: {
      echo: req.streams.inStream.pipe(through.obj())
    }
  })
}

server.listen(4200, function () {
  console.log('server ready')
})
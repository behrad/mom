const tentacoli = require('tentacoli')
const net = require('net')
const from = require('from2')
const through = require('through2')
const pump = require('pump')

const original = net.connect(4200)

const instance = tentacoli()
pump(original, instance, original)

instance.request({
  cmd: 'a request',
  streams: {
    inStream: from.obj(['hello', 'world'])
  }
}, function (err, result) {
  if (err) {
    throw err
  }

  console.log('--> result is', result.data)
  console.log('--> stream data:')

  result.streams.echo.pipe(through.obj(function (chunk, enc, cb) {
    cb(null, chunk + '\n')
  })).pipe(process.stdout)
  result.streams.echo.on('end', function () {
    console.log('--> ended')
    instance.destroy()
  })
})
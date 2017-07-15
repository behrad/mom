const UpRingPubsub = require('upring-pubsub')

const broker = UpRingPubsub({
  base: process.argv.slice(2)
})

broker.on('#', function (msg, cb) {
  console.log(msg)
  cb()
})

broker.upring.on('up', function () {
  console.log('node ', this.whoami())
})

let count = 0

setInterval(function () {
  count++
  broker.emit({
    topic: 'hello',
    count,
    payload: `from ${process.pid}`
  })
}, 1000)
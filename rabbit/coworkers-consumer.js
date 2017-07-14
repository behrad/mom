const coworkers = require('coworkers')
const app = coworkers()

app.queue('coworkers-job', function * () {
  this.ack = true
})
app.on('error', function (err, channel, context) {
  console.error(err)
  if (channel) {
    channel.nack(context.message).catch(function (err) {
      console.error(err)
    })
  }
})

app.connect()
const Rascal = require('rascal')

const definitions = {
  "vhosts": {
    "v1": {
      "connection": [
        "amqp://admin:mqadminP@ssw0rd@10.10.101.115:5672?heartbeat=30",
        "amqp://admin:mqadminP@ssw0rd@10.10.101.116:5672?heartbeat=30",
      ]
    }
  }
}

const config = Rascal.withDefaultConfig(definitions)
Rascal.Broker.create(Rascal.withDefaultConfig(config), function(err, broker) {
  err && console.log(err);

  broker.on('error', function(err) {
    console.error('Error ', err.message)
  })

  console.log('@@@ ', broker);

  process.on('SIGINT', function() {
    broker.shutdown(function() {
      process.exit()
    })
  })
});
const kafka = require('kafka-node');

const client = new kafka.Client('10.10.151.27:2181', 'my-test-nodejs-client');

const producer = new kafka.HighLevelProducer(client, {
  requireAcks: 1,
  ackTimeoutMs: 100,
  partitionerType: 2
});

producer.on('error', err => {
  console.log('Error ', err);
});

producer.on('ready', () => {
  setInterval( ()=>{
    producer.send([{
      topic: 'topicName',
      messages: ['message body ' + new Date]
    }], function (err, data) {
      if(err)
        return console.error('Error sending ', err);

      console.log('Payload sent ', data);
    });
  }, 2000)
});